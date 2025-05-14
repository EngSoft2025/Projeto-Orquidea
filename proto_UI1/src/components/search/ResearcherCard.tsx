
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResearcherCardProps {
  id: string;
  name: string;
  institution: string;
  position: string;
  publicationsCount: number;
  citationsCount: number;
  areas: string[];
}

export default function ResearcherCard({
  id,
  name,
  institution,
  position,
  publicationsCount,
  citationsCount,
  areas,
}: ResearcherCardProps) {
  return (
    <Card className="hover-card border border-border/50">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/profile/${id}`} className="text-lg font-semibold hover:text-primary">
              {name}
            </Link>
            <p className="text-sm text-muted-foreground mb-2">
              {position} • {institution}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {areas.map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Publicações</p>
                <p className="font-semibold">{publicationsCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Citações</p>
                <p className="font-semibold">{citationsCount}</p>
              </div>
            </div>
          </div>
          <a
            href={`https://orcid.org/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            ORCID
          </a>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="w-full">
            Adicionar ao Monitoramento
          </Button>
          <Link to={`/profile/${id}`} className="w-full">
            <Button size="sm" variant="default" className="w-full">
              Ver Perfil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
