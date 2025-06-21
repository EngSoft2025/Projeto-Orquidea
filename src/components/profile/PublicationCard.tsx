
import { useState } from "react";
import { 
  ExternalLink, 
  BookOpen, 
  FileText, 
  Copy, 
  Check,
  Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PublicationCardProps {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  citationCount: number;
  type: "article" | "conference" | "book" | "thesis";
}

export default function PublicationCard({
  id,
  title,
  authors,
  journal,
  year,
  doi,
  citationCount,
  type,
}: PublicationCardProps) {
  const [copied, setCopied] = useState(false);
  
  const typeIcons = {
    article: <FileText className="h-4 w-4" />,
    conference: <Eye className="h-4 w-4" />,
    book: <BookOpen className="h-4 w-4" />,
    thesis: <FileText className="h-4 w-4" />,
  };
  
  const typeLabels = {
    article: "Artigo",
    conference: "Conferência",
    book: "Livro",
    thesis: "Tese",
  };

  const copyToClipboard = () => {
    const citation = `${authors.join(", ")}. (${year}). ${title}. ${journal}.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="publication-card border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="flex items-center gap-1 text-xs font-normal">
                {typeIcons[type]} 
                {typeLabels[type]}
              </Badge>
              <span className="text-sm text-muted-foreground">{year}</span>
            </div>
            
            <h3 className="font-semibold mb-1.5">{title}</h3>
            
            <p className="text-sm text-muted-foreground mb-1.5">
              {authors.slice(0, 3).join(", ")}
              {authors.length > 3 && " et al."}
            </p>
            
            <p className="text-sm italic mb-2">{journal}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                <span className="text-sm mr-4">Citações: {citationCount}</span>
                {doi && (
                  <a 
                    href={`https://doi.org/${doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    DOI
                  </a>
                )}
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-8 w-8"
                    >
                      {copied ? 
                        <Check className="h-4 w-4 text-green-500" /> : 
                        <Copy className="h-4 w-4" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copiado!" : "Copiar citação"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
