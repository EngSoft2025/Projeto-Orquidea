import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Briefcase, 
  GraduationCap, 
  Link as LinkIcon, 
  Info, 
  CalendarIcon,
  Filter,
  FileText,
  Loader2, 
  ExternalLink, 
  KeySquare, 
} from "lucide-react";

// Imports de Componentes e Lógica
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ProfileHeader from "@/components/profile/ProfileHeader"; 
import PublicationCard from "@/components/profile/PublicationCard"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge"; 
import { useToast } from "@/hooks/use-toast";
import { account } from "@/lib/appwrite";
import { 
    fetchOrcidProfile, 
    type OrcidFullRecord, 
    type OrcidWorkSummary,
    type OrcidAffiliation,
    type OrcidResearcherUrl,
    type OrcidExternalIdentifier
} from "@/lib/profile_info_query"; 

// Tipagem e funções utilitárias
interface FormattedPublication {
  id: string; title: string; authors: string[]; journal: string;
  year: number; doi: string | null; type: string;
}
const formatDate = (dateObj: { year: { value: string } | null, month?: { value: string } | null, day?: { value: string } | null } | null | undefined): string => {
  if (!dateObj?.year?.value) return 'Presente'; 
  let dateStr = dateObj.year.value;
  if (dateObj.month?.value) {
    dateStr += `-${dateObj.month.value.padStart(2, '0')}`; 
    if (dateObj.day?.value) {
      dateStr += `-${dateObj.day.value.padStart(2, '0')}`; 
    }
  }
  return dateStr;
};


// --- Componente Principal ---
export default function Profile() {
  const router = useRouter();
  const orcidIdFromQuery = router.query.id as string;
  const { toast } = useToast();

  // Estados da página: autenticação e lógica de monitoramento
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isMonitoringLoading, setIsMonitoringLoading] = useState(false);
  const [isAlreadyMonitored, setIsAlreadyMonitored] = useState(false);

  // Estados de UI existentes
  const [activeTab, setActiveTab] = useState("overview"); 
  const [yearFilter, setYearFilter] = useState("all");
  const [publicationSearchQuery, setPublicationSearchQuery] = useState("");

  // Hook SWR para buscar dados do ORCID
  const { 
    data: orcidProfileData, 
    error: orcidProfileError, 
    isLoading: isLoadingOrcidProfile 
  } = useSWR<OrcidFullRecord>(
    orcidIdFromQuery ? `/orcid/profile/${orcidIdFromQuery}` : null, 
    () => fetchOrcidProfile(orcidIdFromQuery),
    { revalidateOnFocus: false }
  );
  
  // useEffect para verificar a sessão do Appwrite
  useEffect(() => {
    setIsSessionLoading(true);
    account.get()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setIsSessionLoading(false));
  }, []);

  // useEffect para verificar o status de monitoramento ao carregar a página
  useEffect(() => {
    // Só executa se tivermos um usuário logado e um ORCID da URL
    if (currentUser && orcidIdFromQuery) {
      const checkMonitoringStatus = async () => {
        try {
          const response = await fetch(`/api/monitoring/status?userEmail=${currentUser.email}&orcid=${orcidIdFromQuery}`);
          
          if (!response.ok) {
            console.error("Falha ao buscar status de monitoramento.");
            return;
          }

          const data = await response.json();
          
          // Atualiza o estado do botão com base na resposta da API
          setIsAlreadyMonitored(data.isMonitored);

        } catch (error) {
          console.error("Erro na chamada da API de status:", error);
        }
      };

      checkMonitoringStatus();
    }
  }, [currentUser, orcidIdFromQuery]); // Dependências: Roda sempre que o usuário ou o ORCID da página mudar

  // Função `useMemo` para processar dados do ORCID
  const processedProfileData = useMemo(() => {
    if (!orcidProfileData) return null;
    const person = orcidProfileData.person;
    const activities = orcidProfileData['activities-summary']; 
    const profileName = person?.name?.['credit-name']?.value || `${person?.name?.['given-names']?.value || ''} ${person?.name?.['family-name']?.value || ''}`.trim() || "Nome Desconhecido";
    const biography = person?.biography?.content || null;
    const researcherUrls: OrcidResearcherUrl[] = (person as any)?.['researcher-urls']?.['researcher-url'] || [];
    const externalIdentifiers: OrcidExternalIdentifier[] = (person as any)?.['external-identifiers']?.['external-identifier'] || [];
    const employmentsArray: OrcidAffiliation[] = [];
    (activities as any)?.employments?.['affiliation-group']?.forEach((group: any) => { group.summaries?.forEach((summary: any) => { if (summary['employment-summary']) employmentsArray.push(summary['employment-summary']); }); });
    if (Array.isArray((activities as any)?.employments?.['employment-summary'])) { (activities as any)?.employments?.['employment-summary'].forEach((summary: any) => employmentsArray.push(summary)); }
    employmentsArray.sort((a, b) => (parseInt(b['start-date']?.year?.value || "0") - parseInt(a['start-date']?.year?.value || "0")));
    const educationsArray: OrcidAffiliation[] = [];
    (activities as any)?.educations?.['affiliation-group']?.forEach((group: any) => { group.summaries?.forEach((summary: any) => { if (summary['education-summary']) educationsArray.push(summary['education-summary']); }); });
    if (Array.isArray((activities as any)?.educations?.['education-summary'])) { (activities as any)?.educations?.['education-summary'].forEach((summary: any) => educationsArray.push(summary)); }
    educationsArray.sort((a, b) => (parseInt(b['end-date']?.year?.value || b['start-date']?.year?.value || "0") - parseInt(a['end-date']?.year?.value || a['start-date']?.year?.value || "0")));
    const primaryAffiliation = employmentsArray.length > 0 ? employmentsArray[0] : null;
    const institutionName = primaryAffiliation?.organization.name || "Instituição Não Informada";
    const departmentName = primaryAffiliation?.['department-name'] || ""; 
    const positionTitle = primaryAffiliation?.['role-title'] || "Cargo Não Informado";
    const areas = (person as any)?.keywords?.keyword?.map((k: any) => k.content).filter((k: any) => k) || [];
    const allPublicationsFromAPI: FormattedPublication[] = (activities as any)?.works?.group?.flatMap((g: any) => g['work-summary'] || [])?.map((ws: OrcidWorkSummary) => ({ id: ws['put-code'] ? ws['put-code'].toString() : `work-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, title: ws.title?.title.value || "Título Desconhecido", authors: ws.contributors?.contributor.map(c => c['credit-name']?.value || "Autor Desconhecido").filter(name => name !== "Autor Desconhecido") || ["Autores Desconhecidos"], journal: ws['journal-title']?.value || "Revista/Conferência Desconhecida", year: parseInt(ws['publication-date']?.year.value || "0"), doi: ws['external-ids']?.['external-id']?.find(extId => extId['external-id-type']?.toLowerCase() === 'doi')?.['external-id-value'] || null, type: ws.type?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || "Não Especificado", }))?.filter(p => p && p.title !== "Título Desconhecido")?.sort((a, b) => (b.year || 0) - (a.year || 0)) || [];

    return {
      profileId: orcidProfileData['orcid-identifier'].path, profileName, biography, researcherUrls,
      externalIdentifiers, institutionName, departmentName, positionTitle, areas,
      publicationsCount: allPublicationsFromAPI.length, allPublicationsFromAPI, 
      educations: educationsArray, employments: employmentsArray,
    };
  }, [orcidProfileData]); 

  // Função para adicionar ao monitoramento
  const handleAddToMonitor = async () => {
    if (!currentUser || !processedProfileData) {
      toast({ title: "Ação necessária", description: "Você precisa estar logado para monitorar um pesquisador." });
      return;
    }
    setIsMonitoringLoading(true);
    try {
      const response = await fetch('/api/monitoring/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          researcher: { id: processedProfileData.profileId, name: processedProfileData.profileName },
          publications: processedProfileData.allPublicationsFromAPI.map(p => ({ title: p.title, doi: p.doi })),
        }),
      });
      const result = await response.json();
      if (!response.ok) { throw new Error(result.details || "Falha na resposta da API."); }
      toast({ title: "Sucesso!", description: result.message, className: "bg-green-100 dark:bg-green-900" });
      setIsAlreadyMonitored(true);
    } catch (error) {
      toast({ title: "Erro", description: `Não foi possível adicionar. ${error instanceof Error ? error.message : String(error)}`, variant: "destructive" });
    } finally {
      setIsMonitoringLoading(false);
    }
  };

  // Funções `useMemo` para filtros
  const filteredPublications = useMemo(() => {
    if (!processedProfileData?.allPublicationsFromAPI) return [];
    return processedProfileData.allPublicationsFromAPI.filter((pub) => {
      const matchesSearch = pub.title.toLowerCase().includes(publicationSearchQuery.toLowerCase()) || pub.authors.some(author => author.toLowerCase().includes(publicationSearchQuery.toLowerCase()));
      if (yearFilter === "all") return matchesSearch;
      return matchesSearch && pub.year.toString() === yearFilter;
    });
  }, [processedProfileData?.allPublicationsFromAPI, publicationSearchQuery, yearFilter]);

  const publicationYears = useMemo(() => {
    if (!processedProfileData?.allPublicationsFromAPI) return [];
    return Array.from(new Set(processedProfileData.allPublicationsFromAPI.map(pub => pub.year))).filter(y => y > 0).sort((a, b) => b - a);
  }, [processedProfileData?.allPublicationsFromAPI]);

  // Telas de carregamento e erro
  if (isLoadingOrcidProfile || isSessionLoading) { 
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {isLoadingOrcidProfile ? "Carregando perfil do pesquisador..." : "Verificando sessão..."}
        </p>
      </div>
    );
  }
  if (orcidProfileError) { return <div className="container mx-auto px-4 py-8 text-center text-red-500">Erro ao carregar perfil do ORCID: {orcidProfileError.message}</div>; }
  if (!processedProfileData) { return <div className="container mx-auto px-4 py-8 text-center">Perfil não encontrado ou dados indisponíveis para o ORCID iD: {orcidIdFromQuery}.</div>; }

  // Desestruturação dos dados
  const { profileId, profileName, biography, researcherUrls, externalIdentifiers, institutionName, departmentName, positionTitle, areas, publicationsCount, educations, employments } = processedProfileData;

  // --- Renderização JSX Principal ---
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        id={profileId}
        name={profileName}
        institution={institutionName}
        department={departmentName}
        position={positionTitle}
        orcidId={profileId} 
        areas={areas}
        // Props para controlar o botão de monitoramento, passadas para o Header
        isLoggedIn={!!currentUser}
        isMonitoringLoading={isMonitoringLoading}
        isAlreadyMonitored={isAlreadyMonitored}
        onMonitorClick={handleAddToMonitor}
      />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-6 w-full md:w-auto grid grid-cols-2 md:grid-cols-3"> 
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2"><Info className="h-4 w-4" /> Visão Geral</TabsTrigger>
          <TabsTrigger value="publications" className="flex items-center justify-center gap-2"><FileText className="h-4 w-4" /> Publicações ({publicationsCount})</TabsTrigger>
          <TabsTrigger value="education" className="flex items-center justify-center gap-2"><GraduationCap className="h-4 w-4" /> Formação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          {biography && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5"/> Biografia</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground whitespace-pre-line">{biography}</p></CardContent></Card>}
          {areas && areas.length > 0 && <Card><CardHeader><CardTitle className="flex items-center gap-2"><KeySquare className="h-5 w-5"/> Áreas de Pesquisa / Palavras-chave</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{areas.map((area, index) => (<Badge key={index} variant="secondary">{area}</Badge>))}</CardContent></Card>}
          {employments && employments.length > 0 && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Histórico Profissional</CardTitle></CardHeader><CardContent className="space-y-4">{employments.map((emp, index) => (<div key={emp['put-code'] || index} className="pb-2 mb-2 border-b last:border-b-0"><h4 className="font-semibold">{emp['role-title'] || 'Cargo não informado'}</h4><p className="text-sm text-muted-foreground">{emp.organization.name}</p>{emp['department-name'] && <p className="text-xs text-muted-foreground">{emp['department-name']}</p>}<p className="text-xs text-muted-foreground">{formatDate(emp['start-date'])} – {formatDate(emp['end-date'])}</p></div>))}</CardContent></Card>}
          {(researcherUrls.length > 0 || externalIdentifiers.length > 0) && <Card><CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5"/> Links Externos e Perfis</CardTitle></CardHeader><CardContent className="space-y-2">{researcherUrls.map(urlObj => (urlObj.url?.value && <a key={urlObj['put-code']} href={urlObj.url.value} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">{urlObj['url-name'] || urlObj.url.value} <ExternalLink className="h-3 w-3 ml-1"/></a>))}{externalIdentifiers.map(extId => (extId['external-id-value'] && <a key={extId['put-code']} href={extId['external-id-url']?.value || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-primary hover:underline">{extId['external-id-type']}: {extId['external-id-value']}{extId['external-id-url']?.value && <ExternalLink className="h-3 w-3 ml-1"/>}</a>))}</CardContent></Card>}
        </TabsContent>

        <TabsContent value="publications" className="mt-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-grow"><Input placeholder="Buscar publicações por título ou autor..." value={publicationSearchQuery} onChange={(e) => setPublicationSearchQuery(e.target.value)} className="pl-10"/><Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" /></div>
              <div className="flex items-center gap-3"><CalendarIcon className="h-5 w-5 text-muted-foreground" /><Select value={yearFilter} onValueChange={setYearFilter}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filtrar por ano" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os anos</SelectItem>{publicationYears.map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent></Select></div>
          </div>
          <div className="space-y-4">
              {isLoadingOrcidProfile ? <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" /><p className="text-muted-foreground">Carregando publicações...</p></div> : filteredPublications.length > 0 ? (filteredPublications.map((publication) => (<PublicationCard key={publication.id} id={publication.id} title={publication.title} authors={publication.authors} journal={publication.journal} year={publication.year} doi={publication.doi} type={publication.type} />))) : (<div className="text-center py-8"><p className="text-muted-foreground">Nenhuma publicação encontrada {publicationSearchQuery || yearFilter !== "all" ? "com os filtros selecionados" : "para este pesquisador"}.</p></div>)}
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-0 space-y-4">
            {educations && educations.length > 0 ? (educations.map((edu, index) => (<Card key={edu['put-code'] || index}><CardContent className="p-4"><h4 className="font-semibold">{edu['role-title'] || 'Formação não especificada'}</h4><p className="text-sm text-muted-foreground">{edu.organization.name}</p>{edu['department-name'] && <p className="text-xs text-muted-foreground">{edu['department-name']}</p>}<p className="text-xs text-muted-foreground">{formatDate(edu['start-date'])} – {formatDate(edu['end-date'])}</p></CardContent></Card>))) : (<div className="text-center py-8"><p className="text-muted-foreground">Nenhuma informação sobre formação acadêmica disponível.</p></div>)}
        </TabsContent>
      </Tabs>
    </div>
  );
}