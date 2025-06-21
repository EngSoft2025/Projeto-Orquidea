import { useEffect, useState } from "react";
import useSWR from "swr";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
// Certifique-se de que este caminho está correto para o seu ResearcherCard atualizado
import ResearcherCard from "@/components/search/ResearcherCard";
import { fetchOrcidSearch } from "@/lib/orcid_query";
import { useRouter } from "next/router";

// Interface para um item individual da busca ORCID, para tipagem no SearchResults
interface OrcidExpandedResultItem {
  "orcid-id": string;
  "given-names": string | null;
  "family-names": string | null;
  "credit-name"?: string | null;
  "institution-name"?: string[];
}

// Helper function for SearchResults
function getArrayFromData(data: any, key: string): OrcidExpandedResultItem[] {
  if (!data || !data[key]) {
    return [];
  }
  const potentialArray = data[key];
  // Adicionando console.log para depuração da getArrayFromData
  // console.log("getArrayFromData - potentialArray:", JSON.stringify(potentialArray, null, 2));
  return Array.isArray(potentialArray) ? potentialArray : [];
}

function SearchResults({ searchQuery }: { searchQuery: string }) {
  const {
    data,
    isLoading,
    error: researchersError,
  } = useSWR(searchQuery ? `q=${searchQuery}` : null, () =>
    fetchOrcidSearch(searchQuery)
  );

  // Adicionando console.logs para depuração do estado da busca
  // console.log("SearchResults - searchQuery:", searchQuery);
  // console.log("SearchResults - isLoading:", isLoading);
  // console.log("SearchResults - researchersError:", researchersError);
  // console.log("SearchResults - raw SWR data:", JSON.stringify(data, null, 2));

  if (searchQuery === "") {
    return (
      <p className="text-muted-foreground text-center mt-4">
        Digite um termo para iniciar a busca por pesquisadores.
      </p>
    );
  }

  if (isLoading) {
    return <div className="text-center mt-4">Carregando pesquisadores...</div>;
  }

  if (researchersError) {
    return (
      <div className="text-center mt-4 text-red-600">
        Erro ao carregar pesquisadores: {researchersError.message}
      </div>
    );
  }

  const researchersArray: OrcidExpandedResultItem[] = getArrayFromData(
    data,
    "expanded-result"
  );
  // Adicionando console.log para depuração do array processado
  // console.log("SearchResults - researchersArray ANTES do map:", JSON.stringify(researchersArray, null, 2));

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {researchersArray.length} resultado(s)
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      </div>

      {researchersArray.length === 0 && !isLoading && (
        <p className="text-center mt-4">
          Nenhum pesquisador encontrado para "{searchQuery}".
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchersArray.map((researcher, index) => {
          // Adicionando console.log para depuração de cada item do array
          // console.log(`SearchResults - Item ${index} do array ANTES do card:`, JSON.stringify(researcher, null, 2));

          // A verificação principal de 'researcher' e 'researcher["orcid-id"]'
          // agora está dentro do ResearcherCard.
          // Mantemos uma verificação básica aqui para a chave do map.
          if (!researcher || !researcher["orcid-id"]) {
            // console.warn(`SearchResults - Item ${index} pulado no map devido a dados inválidos ou orcid-id ausente:`, researcher);
            return null;
          }

          // A lógica para 'fullName' e 'institutionName' foi movida para dentro do ResearcherCard.
          // Passamos o objeto 'researcher' diretamente.
          return (
            <ResearcherCard
              key={researcher["orcid-id"]}
              researcherData={researcher} // Passa o objeto completo do pesquisador
            />
          );
        })}
      </div>
    </div>
  );
}

function getFirstSearchQueryValue(
  query: string | string[] | undefined
): string {
  if (Array.isArray(query)) {
    return query[0] || "";
  }
  return query || "";
}

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(getFirstSearchQueryValue(router.query.query));
  }, [router.query.query]);

  const onSearch = (query: string) => {
    router.push({ query: { query } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Busca de Pesquisadores
      </h1>

      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
      </div>

      <SearchResults searchQuery={searchQuery} />
    </div>
  );
}
