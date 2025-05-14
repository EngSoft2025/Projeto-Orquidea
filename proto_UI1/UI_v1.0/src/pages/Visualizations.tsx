
import { useState } from "react";
import { 
  BarChart3, 
  Network, 
  Share2,
  Download,
  User,
  BookOpen,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraphCard from "@/components/visualizations/GraphCard";

// Mock data
const citationsData = [
  { name: "2018", value: 34 },
  { name: "2019", value: 45 },
  { name: "2020", value: 67 },
  { name: "2021", value: 89 },
  { name: "2022", value: 103 },
  { name: "2023", value: 128 },
];

const publicationsData = [
  { name: "2018", value: 7 },
  { name: "2019", value: 9 },
  { name: "2020", value: 12 },
  { name: "2021", value: 8 },
  { name: "2022", value: 15 },
  { name: "2023", value: 11 },
];

const areasData = [
  { name: "Física Quântica", value: 45 },
  { name: "Computação Quântica", value: 30 },
  { name: "Nanotecnologia", value: 15 },
  { name: "Óptica Quântica", value: 10 },
];

export default function Visualizations() {
  const [researcherId, setResearcherId] = useState("");
  const [visualization, setVisualization] = useState("overview");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Visualizações</h1>
      
      <Card className="mb-8 border border-border/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Pesquisador ou Instituição
              </label>
              <div className="relative">
                <Input 
                  placeholder="Digite o nome do pesquisador ou ID ORCID..." 
                  className="pl-10"
                  value={researcherId}
                  onChange={e => setResearcherId(e.target.value)}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Visualização
              </label>
              <Select 
                value={visualization}
                onValueChange={setVisualization}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="citations">Citações</SelectItem>
                  <SelectItem value="collaborations">Colaborações</SelectItem>
                  <SelectItem value="institutions">Instituições</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button>Gerar Visualizações</Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="charts" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Gráficos
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="h-4 w-4" /> Redes de Colaboração
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="mt-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="5-years">Últimos 5 anos</SelectItem>
                  <SelectItem value="3-years">Últimos 3 anos</SelectItem>
                  <SelectItem value="year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" /> Exportar
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" /> Compartilhar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GraphCard
              title="Publicações por Ano"
              type="bar"
              data={publicationsData}
            />
            <GraphCard
              title="Citações por Ano"
              type="line"
              data={citationsData}
            />
            <GraphCard
              title="Distribuição por Área"
              type="pie"
              data={areasData}
            />
            <Card className="border border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Publicações</h4>
                    </div>
                    <p className="text-3xl font-bold">62</p>
                    <p className="text-sm text-muted-foreground">Total de publicações</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Citações</h4>
                    </div>
                    <p className="text-3xl font-bold">466</p>
                    <p className="text-sm text-muted-foreground">Total de citações</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">h-index</h4>
                    </div>
                    <p className="text-3xl font-bold">28</p>
                    <p className="text-sm text-muted-foreground">Índice h</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-2">
                      <Network className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Colaboradores</h4>
                    </div>
                    <p className="text-3xl font-bold">37</p>
                    <p className="text-sm text-muted-foreground">Total de coautores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="network" className="mt-0">
          <div className="text-center py-12 bg-secondary/50 rounded-lg">
            <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Visualização de Rede de Colaboração</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Selecione um pesquisador e uma distância de conexão para visualizar sua rede de colaboração.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mt-6">
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 text-left">
                  Distância de Conexão
                </label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Distância" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 passo</SelectItem>
                    <SelectItem value="2">2 passos</SelectItem>
                    <SelectItem value="3">3 passos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-medium mb-2 text-left">
                  Tipo de Conexão
                </label>
                <Select defaultValue="collaboration">
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaboration">Colaboração</SelectItem>
                    <SelectItem value="citation">Citação</SelectItem>
                    <SelectItem value="institution">Instituição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full sm:self-end">Gerar Grafo</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
