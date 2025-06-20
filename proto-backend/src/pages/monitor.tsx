// src/pages/Monitor.js (Versão Final com Função de Remover)

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Plus, Bell, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import MonitorCard from "@/components/monitor/MonitorCard";
import Layout from "@/components/layout/Layout";
import { account } from "@/lib/appwrite";
import { useToast } from "@/hooks/use-toast"; // Importe o useToast
import { Models } from "appwrite";

export default function Monitor() {
  const [currentUser, setCurrentUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [monitoredData, setMonitoredData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast(); // Inicialize o hook

  // Efeito para verificar a sessão (sem alterações)
  useEffect(() => {
    // ... sua lógica de checkSession ...
    const checkSession = async () => {
        setIsSessionLoading(true);
        try { const user = await account.get(); setCurrentUser(user); } catch (error) { setCurrentUser(null); } finally { setIsSessionLoading(false); }
    };
    checkSession();
  }, []);

  // Efeito para buscar os dados (sem alterações)
  useEffect(() => {
    if (currentUser) {
      // ... sua lógica de fetchMonitoredData ...
      const fetchMonitoredData = async () => {
          setIsDataLoading(true);
          try {
              const response = await fetch(`/api/monitoring/monitored-researchers?userEmail=${currentUser.email}`);
              const data = await response.json();
              if (!response.ok) { throw new Error(data.error || "Falha ao buscar dados."); }
              setMonitoredData(data);
          } catch (error) { console.error(error); } finally { setIsDataLoading(false); }
      };
      fetchMonitoredData();
    }
  }, [currentUser]);

  // --- NOVA FUNÇÃO: Lidar com a remoção de um pesquisador ---
  const handleRemoveResearcher = async (orcidIdToRemove: string) => {
    if (!currentUser) {
      toast({ title: "Erro", description: "Você precisa estar logado para remover.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch('/api/monitoring/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          orcid: orcidIdToRemove,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Falha ao remover pesquisador.");
      }

      // ATUALIZAÇÃO IMEDIATA DA UI:
      // Filtra a lista de dados, removendo o pesquisador com o ID correspondente.
      setMonitoredData(currentData => 
        currentData.filter(researcher => researcher.orcid_id !== orcidIdToRemove)
      );

      toast({
        title: "Sucesso!",
        description: result.message,
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: `Não foi possível remover o pesquisador. ${error instanceof Error ? error.message : ""}`,
        variant: "destructive",
      });
    }
  };

  // Telas de Carregamento e Não Logado (sem alterações)
  if (isSessionLoading) { /* ... */ return <Layout><div className="container text-center py-20"><p>Verificando sua sessão...</p></div></Layout> }
  if (!currentUser) { /* ... */ return <Layout><div className="container text-center py-20"><h2 className="text-2xl font-bold">Acesso Restrito</h2><p>Faça login para ver seus monitoramentos.</p><Button className="mt-4" onClick={() => router.push('/auth')}>Fazer Login</Button></div></Layout> }

  // --- Renderização Principal ---
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Pesquisadores Monitorados</h1>
        </div>

        {isDataLoading ? (
          <div className="text-center py-12"><p className="text-lg">Buscando seus pesquisadores...</p></div>
        ) : monitoredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitoredData.map((researcher) => (
              // --- ALTERADO AQUI: Passando as novas props e a função onRemove ---
              <MonitorCard
                key={researcher.orcid_id}
                id={researcher.orcid_id}
                name={researcher.name}
                institution={researcher.institution} // Vem da nossa API (atualmente um placeholder)
                onRemove={handleRemoveResearcher} // Passando a função de remoção
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Nenhum pesquisador monitorado</h3>
            <p className="text-muted-foreground mb-4">Encontre pesquisadores para começar a acompanhar.</p>
            <Button onClick={() => router.push('/search')}>
              <Search className="h-4 w-4 mr-2" /> Procurar Pesquisadores
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}