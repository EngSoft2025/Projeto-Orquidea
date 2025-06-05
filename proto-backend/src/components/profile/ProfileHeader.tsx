import { User, MapPin } from "lucide-react"; // BookOpen e Star removidos
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Props de contagem (publicationsCount, citationsCount, hIndex) foram removidas
interface ProfileHeaderProps {
  id: string; // Mantido para uso futuro ou identificação, se necessário
  name: string;
  institution: string;
  department?: string;
  position: string;
  orcidId: string; // Mantido para o link do perfil ORCID
  areas: string[];
  photoUrl?: string;
}

export default function ProfileHeader({
  id,
  name,
  institution,
  department,
  position,
  orcidId,
  areas,
  photoUrl,
}: ProfileHeaderProps) {
  return (
    <div className="bg-secondary p-6 rounded-lg mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Avatar className="h-28 w-28">
          {photoUrl ? (
            <AvatarImage src={photoUrl} alt={name} />
          ) : (
            <AvatarFallback className="text-4xl bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl font-bold mb-2">{name}</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 mb-4 text-sm text-secondary-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{position}{department && `, ${department}`}</span>
            </div>
            <div className="hidden md:block font-bold">•</div>
            <span>{institution}</span>
          </div>
          
          {areas && areas.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-1 mb-4">
              {areas.map((area, index) => (
                <Badge key={index} variant="outline" className="bg-background/50">
                  {area}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Seção do grid com os cards de Publicações, Citações e H-index foi REMOVIDA */}
          
          <div className="flex flex-col md:flex-row gap-3 mt-4"> {/* Adicionado mt-4 para espaçamento se a grid de métricas for removida */}
            <Button className="flex-1">Adicionar ao Monitoramento</Button>
            <Button variant="outline" className="flex-1" asChild>
              <a 
                href={`https://orcid.org/${orcidId}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full"
              >
                Perfil ORCID 
                {/* Ícone ExternalLink poderia ser adicionado aqui se desejado, como no ResearcherCard */}
                {/* <ExternalLink className="h-4 w-4 ml-2" /> */}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
