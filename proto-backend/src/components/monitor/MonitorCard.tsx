import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Usaremos um diálogo de confirmação

interface MonitorCardProps {
  id: string;      // ORCID iD
  name: string;
  institution: string; // Vamos assumir que receberemos a instituição
  // Função que será chamada quando o botão de remover for clicado
  onRemove: (orcidId: string) => void; 
}

export default function MonitorCard({ id, name, institution, onRemove }: MonitorCardProps) {
  return (
    <Card className="hover-card border border-border/50 flex flex-col h-full">
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link
            href={`/profile/${id}`}
            className="text-lg font-semibold hover:text-primary line-clamp-2 mb-2 block"
            title={name}
          >
            {name}
          </Link>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {institution || "Instituição não informada"}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
          <Link href={`/profile/${id}`} className="w-full" passHref>
            <Button as="a" size="sm" variant="outline" className="w-full text-xs">
              <Eye className="h-3 w-3 mr-2" />
              Ver Perfil
            </Button>
          </Link>

          {/* Diálogo de Confirmação para Remoção */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full text-xs">
                <Trash2 className="h-3 w-3 mr-2" />
                Remover
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação removerá permanentemente **{name}** da sua lista de monitoramento. Você não receberá mais notificações sobre este pesquisador.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemove(id)}>
                  Sim, remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}