
import { useState } from "react";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonitorCard from "@/components/monitor/MonitorCard";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data
const monitoredResearchers = [
  {
    id: "0000-0002-3456-7890",
    name: "Carlos Eduardo Martins",
    institution: "Universidade Federal do Rio de Janeiro",
    position: "Professor Titular",
    lastUpdate: "2 dias atrás",
    notificationsEnabled: true,
    recentChanges: [
      {
        type: "publication" as const,
        title: "Novel approaches in quantum computing for solving optimization problems",
      },
    ],
  },
  {
    id: "0000-0001-2345-6789",
    name: "Ana Luiza Silva",
    institution: "Universidade de São Paulo",
    position: "Professora Associada",
    lastUpdate: "5 dias atrás",
    notificationsEnabled: true,
    recentChanges: [
      {
        type: "citation" as const,
        count: 3,
      },
    ],
  },
  {
    id: "0000-0003-4567-8901",
    name: "Roberta Almeida Costa",
    institution: "Universidade Estadual de Campinas",
    position: "Pesquisadora",
    lastUpdate: "1 semana atrás",
    notificationsEnabled: false,
    recentChanges: [],
  },
];

const monitoredPublications = [
  {
    id: "10.5678/efgh.5678",
    title: "Novel approaches in quantum computing for solving optimization problems",
    authors: ["Carlos Eduardo Martins", "James Wilson", "Robert Johnson"],
    journal: "Quantum Information Processing",
    year: 2023,
    lastUpdate: "3 dias atrás",
    notificationsEnabled: true,
    recentChanges: [
      {
        type: "citation" as const,
        count: 2,
      },
    ],
  },
  {
    id: "10.9012/ijkl.9012",
    title: "Deep learning techniques for genomic data analysis",
    authors: ["Roberta Almeida Costa", "Leonardo Fernandes", "Sofia Torres"],
    journal: "BMC Bioinformatics",
    year: 2022,
    lastUpdate: "1 semana atrás",
    notificationsEnabled: true,
    recentChanges: [
      {
        type: "citation" as const,
        count: 5,
      },
    ],
  },
];

export default function Monitor() {
  const [activeTab, setActiveTab] = useState("researchers");
  const [globalNotifications, setGlobalNotifications] = useState(true);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Monitoramento</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Adicionar ao Monitoramento
        </Button>
      </div>
      
      <Card className="mb-8 border border-border/50">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configurações de Notificação</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status das Notificações</p>
                <p className="text-sm text-muted-foreground">
                  Ative ou desative todas as notificações
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="global-notifications" className="text-sm">
                  {globalNotifications ? "Ativadas" : "Desativadas"}
                </Label>
                <Switch
                  id="global-notifications"
                  checked={globalNotifications}
                  onCheckedChange={setGlobalNotifications}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Novas Publicações</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Novas Citações</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Atualizações de Perfil</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline">Salvar Configurações</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="researchers">Pesquisadores</TabsTrigger>
          <TabsTrigger value="publications">Publicações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="researchers" className="mt-0">
          {monitoredResearchers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monitoredResearchers.map((researcher) => (
                <MonitorCard
                  key={researcher.id}
                  id={researcher.id}
                  name={researcher.name}
                  institution={researcher.institution}
                  position={researcher.position}
                  lastUpdate={researcher.lastUpdate}
                  notificationsEnabled={researcher.notificationsEnabled}
                  recentChanges={researcher.recentChanges}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/50 rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum pesquisador monitorado</h3>
              <p className="text-muted-foreground mb-4">
                Adicione pesquisadores à sua lista para receber atualizações sobre seus perfis.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Pesquisador
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="publications" className="mt-0">
          {monitoredPublications.length > 0 ? (
            <div className="space-y-4">
              {monitoredPublications.map((publication) => (
                <Card key={publication.id} className="border border-border/50">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{publication.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {publication.authors.slice(0, 3).join(", ")}
                          {publication.authors.length > 3 && " et al."}
                        </p>
                        <p className="text-sm italic mb-2">
                          {publication.journal}, {publication.year}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Última atualização: {publication.lastUpdate}
                        </p>
                        
                        {publication.recentChanges.length > 0 && (
                          <div className="mt-3 p-2 bg-secondary/50 rounded text-sm">
                            <p>
                              {publication.recentChanges[0].type === "citation" && 
                               `+${publication.recentChanges[0].count} novas citações`}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <Switch
                          checked={publication.notificationsEnabled}
                          className="mr-2"
                        />
                        <Button variant="ghost" size="icon">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/50 rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma publicação monitorada</h3>
              <p className="text-muted-foreground mb-4">
                Adicione publicações à sua lista para receber atualizações sobre novas citações.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Publicação
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
