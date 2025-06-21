import { User, MapPin, Monitor, Check, Loader2, ExternalLink } from "lucide-react"; // Adicionados Monitor, Check, Loader2, ExternalLink
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// --- ALTERADO: Interface de Props atualizada ---
interface ProfileHeaderProps {
  id: string;
  name: string;
  institution: string;
  department?: string;
  position: string;
  orcidId: string;
  areas: string[];
  photoUrl?: string;
  // --- ADICIONADO: Props para controlar o botão de monitoramento ---
  isLoggedIn: boolean; // Para saber se o usuário está logado
  isMonitoringLoading: boolean; // Para o estado de "carregando" do botão
  isAlreadyMonitored: boolean; // Para saber se já está monitorando
  onMonitorClick: () => void; // A função a ser chamada ao clicar no botão
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
  // --- ADICIONADO: Desestruturação das novas props ---
  isLoggedIn,
  isMonitoringLoading,
  isAlreadyMonitored,
  onMonitorClick,
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
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            
            {/* --- ALTERADO: Lógica do botão de monitoramento --- */}
            {isLoggedIn && (
              <Button 
                onClick={onMonitorClick} 
                disabled={isMonitoringLoading || isAlreadyMonitored}
                className="flex-1"
              >
                {isMonitoringLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isAlreadyMonitored ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Monitor className="mr-2 h-4 w-4" />
                )}
                {isMonitoringLoading ? "Processando..." : isAlreadyMonitored ? "Monitorando" : "Adicionar ao Monitoramento"}
              </Button>
            )}

            <Button variant="outline" className="flex-1" asChild>
              <a 
                href={`https://orcid.org/${orcidId}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full"
              >
                Perfil ORCID 
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}