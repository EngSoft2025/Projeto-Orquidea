import { useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import FilterSection from "@/components/search/FilterSection";
import ResearcherCard from "@/components/search/ResearcherCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PublicationCard from "@/components/profile/PublicationCard";
import Layout from "@/components/layout/Layout";
import useSWR from "swr";
import { fetchOrcidSearch } from "@/lib/orcid_query";

// Mock data
const researchers = [
  {
    id: "0000-0001-2345-6789",
    name: "Ana Luiza Silva",
    institution: "Universidade de São Paulo",
    position: "Professora Associada",
    publicationsCount: 78,
    citationsCount: 1245,
    areas: ["Bioinformática", "Genômica", "Biologia Computacional"],
  },
  {
    id: "0000-0002-3456-7890",
    name: "Carlos Eduardo Martins",
    institution: "Universidade Federal do Rio de Janeiro",
    position: "Professor Titular",
    publicationsCount: 112,
    citationsCount: 3476,
    areas: ["Física Quântica", "Nanotecnologia"],
  },
  {
    id: "0000-0003-4567-8901",
    name: "Roberta Almeida Costa",
    institution: "Universidade Estadual de Campinas",
    position: "Pesquisadora",
    publicationsCount: 45,
    citationsCount: 892,
    areas: [
      "Inteligência Artificial",
      "Aprendizado de Máquina",
      "Redes Neurais",
    ],
  },
  {
    id: "0000-0004-5678-9012",
    name: "Fernando Santos",
    institution: "Universidade Federal de Minas Gerais",
    position: "Professor Adjunto",
    publicationsCount: 63,
    citationsCount: 1078,
    areas: ["Química Orgânica", "Bioquímica"],
  },
  {
    id: "0000-0005-6789-0123",
    name: "Lúcia Pereira da Costa",
    institution: "Universidade de Brasília",
    position: "Pesquisadora Sênior",
    publicationsCount: 92,
    citationsCount: 2145,
    areas: ["Ciência de Dados", "Estatística Computacional"],
  },
];

const publications = [
  {
    id: "10.1234/abcd.1234",
    title:
      "Análise comparativa de algoritmos de aprendizado de máquina para predição de estruturas proteicas",
    authors: [
      "Ana Luiza Silva",
      "Roberto Mendes",
      "Carlos Eduardo Martins",
      "Maria Oliveira",
    ],
    journal: "Journal of Computational Biology",
    year: 2023,
    doi: "10.1234/abcd.1234",
    citationCount: 12,
    type: "article",
  },
  {
    id: "10.5678/efgh.5678",
    title:
      "Novel approaches in quantum computing for solving optimization problems",
    authors: ["Carlos Eduardo Martins", "James Wilson", "Robert Johnson"],
    journal: "Quantum Information Processing",
    year: 2023,
    doi: "10.5678/efgh.5678",
    citationCount: 8,
    type: "article",
  },
  {
    id: "10.9012/ijkl.9012",
    title: "Deep learning techniques for genomic data analysis",
    authors: ["Roberta Almeida Costa", "Leonardo Fernandes", "Sofia Torres"],
    journal: "BMC Bioinformatics",
    year: 2022,
    doi: "10.9012/ijkl.9012",
    citationCount: 24,
    type: "article",
  },
  {
    id: "10.3456/mnop.3456",
    title:
      "Synthesis and characterization of novel organic compounds for medicinal applications",
    authors: ["Fernando Santos", "Clara Mendes", "João Paulo Ribeiro"],
    journal: "Journal of Medicinal Chemistry",
    year: 2022,
    doi: "10.3456/mnop.3456",
    citationCount: 17,
    type: "article",
  },
  {
    id: "10.7890/qrst.7890",
    title:
      "Statistical methods for large-scale data analysis in social sciences",
    authors: [
      "Lúcia Pereira da Costa",
      "Antônio Gomes",
      "Paulo Soares",
      "Mariana Lima",
    ],
    journal: "Big Data & Society",
    year: 2021,
    doi: "10.7890/qrst.7890",
    citationCount: 31,
    type: "article",
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState("researchers");

  const onSearch = (query: string, type: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Busca Acadêmica</h1>

        <div className="mb-8">
          <SearchBar onSearch={onSearch} />
        </div>

        <div className="mb-6">
          <Tabs
            defaultValue="researchers"
            value={searchTab}
            onValueChange={setSearchTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="researchers">Pesquisadores</TabsTrigger>
              <TabsTrigger value="publications">Publicações</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FilterSection />
              </div>

              <div className="lg:col-span-3">
                <TabsContent value="researchers" className="mt-0">
                  <SearchResults searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="publications" className="mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {publications.length} resultados
                    </p>
                  </div>

                  <div className="space-y-4">
                    {publications.map((publication) => (
                      <PublicationCard
                        key={publication.id}
                        id={publication.id}
                        title={publication.title}
                        authors={publication.authors}
                        journal={publication.journal}
                        year={publication.year}
                        doi={publication.doi}
                        citationCount={publication.citationCount}
                        type={publication.type as any}
                      />
                    ))}
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

function SearchResults({ searchQuery }: { searchQuery: string }) {
  const {
    data,
    isLoading,
    error: researchersError,
  } = useSWR(`q=${searchQuery}`, () => fetchOrcidSearch(searchQuery));
  if (!data || isLoading) return <div>Loading...</div>;
  if (researchersError) {
    return <div>Error loading researchers: {researchersError.message}</div>;
  }
  const researchers = data["expanded-result"];
  console.log(researchers);
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {researchers.length} resultados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {researchers.map((researcher) => (
          <ResearcherCard
            key={researcher["orcid-id"]}
            id={researcher["orcid-id"]}
            name={researcher["given-names"] ?? "Desconhecido"}
            institution={researcher["institution-name"]?.[0] ?? "Desconhecido"}
            position={"Desconhecido"}
            publicationsCount={-1}
            citationsCount={-1}
            areas={["Desconhecido"]}
          />
        ))}
      </div>
    </>
  );
}
