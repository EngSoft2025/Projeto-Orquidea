import { useState } from "react";
import { Bell, BellOff, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface MonitorCardProps {
  id: string;
  name: string;
  photoUrl?: string;
  institution: string;
  position: string;
  lastUpdate: string;
  notificationsEnabled: boolean;
  recentChanges?: {
    type: "publication" | "citation";
    title?: string;
    count?: number;
  }[];
}

export default function MonitorCard({
  id,
  name,
  photoUrl,
  institution,
  position,
  lastUpdate,
  notificationsEnabled: initialNotificationState,
  recentChanges = [],
}: MonitorCardProps) {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialNotificationState
  );

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled
        ? "Notificações desativadas"
        : "Notificações ativadas",
      description: `As notificações para ${name} foram ${
        notificationsEnabled ? "desativadas" : "ativadas"
      }.`,
      duration: 3000,
    });
  };

  const removeFromMonitoring = () => {
    toast({
      title: "Pesquisador removido",
      description: `${name} foi removido da sua lista de monitoramento.`,
      duration: 3000,
    });
  };

  return (
    <Card className="hover-card border border-border/50">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              {photoUrl ? (
                <AvatarImage src={photoUrl} alt={name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <Link
                href={`/profile/${id}`}
                className="font-medium hover:text-primary"
              >
                {name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {position} • {institution}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={toggleNotifications}
                className="ml-1.5"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFromMonitoring}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Última atualização: {lastUpdate}
          </p>

          {recentChanges.length > 0 ? (
            <div className="space-y-2">
              {recentChanges.map((change, index) => (
                <div
                  key={index}
                  className="bg-secondary/50 rounded-md p-2 text-sm"
                >
                  <Badge variant="outline" className="mb-1">
                    {change.type === "publication"
                      ? "Nova publicação"
                      : "Novas citações"}
                  </Badge>
                  {change.type === "publication" ? (
                    <p className="line-clamp-1">{change.title}</p>
                  ) : (
                    <p>{change.count} novas citações</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma alteração recente.
            </p>
          )}
        </div>

        <Link href={`/profile/${id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" /> Ver Perfil
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
