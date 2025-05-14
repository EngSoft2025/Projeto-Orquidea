
import { User, MapPin, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  id: string;
  name: string;
  institution: string;
  department?: string;
  position: string;
  orcidId: string;
  publicationsCount: number;
  citationsCount: number;
  hIndex?: number;
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
  publicationsCount,
  citationsCount,
  hIndex,
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
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4 text-sm text-secondary-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{position}{department && `, ${department}`}</span>
            </div>
            <div className="hidden md:block font-bold">•</div>
            <span>{institution}</span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-1 mb-4">
            {areas.map((area, index) => (
              <Badge key={index} variant="outline" className="bg-background/50">
                {area}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-background/50 rounded">
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm text-muted-foreground">Publicações</p>
              <p className="font-bold">{publicationsCount}</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded">
              <Star className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm text-muted-foreground">Citações</p>
              <p className="font-bold">{citationsCount}</p>
            </div>
            {hIndex && (
              <div className="text-center p-3 bg-background/50 rounded col-span-2 md:col-span-1">
                <p className="text-xl font-bold mb-1">h-index</p>
                <p className="font-bold text-2xl">{hIndex}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <Button className="flex-1">Adicionar ao Monitoramento</Button>
            <Button variant="outline" className="flex-1">
              <a 
                href={`https://orcid.org/${orcidId}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full"
              >
                ORCID Profile
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
