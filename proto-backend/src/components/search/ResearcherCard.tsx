import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Interface para um item individual da busca ORCID, baseado na sua API
interface OrcidExpandedResultItem {
  "orcid-id": string;
  "given-names": string | null;
  "family-names": string | null;
  "credit-name"?: string | null;
  "institution-name"?: string[];
}

interface ResearcherCardProps {
  researcherData?: OrcidExpandedResultItem;
}

export default function ResearcherCard({ researcherData }: ResearcherCardProps) {
  if (!researcherData || typeof researcherData !== 'object' || !researcherData["orcid-id"]) {
    // console.warn("ResearcherCard received invalid or missing researcherData:", researcherData);
    return null;
  }

  const {
    "orcid-id": id, // Este é o ORCID iD usado para a navegação e chave
    "given-names": givenNames,
    "family-names": familyNames,
    "credit-name": creditName,
    "institution-name": institutionNames,
  } = researcherData;

  let displayName = "Nome Desconhecido";
  if (creditName) {
    displayName = creditName;
  } else if (givenNames || familyNames) {
    displayName = `${givenNames || ""} ${familyNames || ""}`.trim();
  }
  if (!displayName.trim()) {
      displayName = "Nome Desconhecido";
  }

  const institutions = institutionNames && institutionNames.length > 0 
    ? institutionNames 
    : ["Instituição não informada"];

  return (
    <Card className="hover-card border border-border/50 flex flex-col h-full">
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-grow">
            {/* Link para o perfil individual do pesquisador */}
            <Link
              href={`/profile/${id}`}
              className="text-lg font-semibold hover:text-primary line-clamp-2"
              title={displayName}
            >
              {displayName}
            </Link>
          </div>
          <a
            href={`https://orcid.org/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-muted-foreground hover:text-primary ml-2 flex-shrink-0"
            title={`Ver perfil ORCID de ${displayName}`}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            ORCID
          </a>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-sm font-medium text-foreground mb-1">Instituições:</p>
          {institutions.length > 0 && institutions[0] !== "Instituição não informada" ? (
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {institutions.map((inst, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {inst}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Instituição não informada</p>
          )}
        </div>
        
        <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="w-full text-xs">
            Adicionar ao Monitoramento
          </Button>
          {/* O componente Link do Next.js envolve o botão "Ver Perfil" */}
          {/* Ele usa o 'id' (ORCID iD) para construir o caminho para a página de perfil dinâmica */}
          <Link href={`/profile/${id}`} className="w-full" passHref>
            <Button as="a" size="sm" variant="default" className="w-full text-xs">
              Ver Perfil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
