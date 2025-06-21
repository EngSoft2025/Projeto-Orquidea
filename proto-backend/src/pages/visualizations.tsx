import { useState } from "react";
import {
  BarChart3,
  Network,
  Share2,
  Download,
  User,
  BookOpen,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraphCard from "@/components/visualizations/GraphCard";
import Layout from "@/components/layout/Layout";

// -- Type definition
type PublicationData = {
  name: string; // year
  value: number; // number of publications
};

// -- Fetch function
async function getPublicationsDataByYear(orcidId: string): Promise<PublicationData[]> {
  try {
    const res = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const groups = data.group || [];
    const yearCountMap: Record<string, number> = {};

    groups.forEach((group: any) => {
      const workSummary = group["work-summary"]?.[0];
      const year = workSummary?.["publication-date"]?.year?.value;
      if (year) yearCountMap[year] = (yearCountMap[year] || 0) + 1;
    });

    return Object.entries(yearCountMap)
      .map(([year, count]) => ({ name: year, value: count }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  } catch (error) {
    console.error("Failed to fetch ORCID data", error);
    return [];
  }
}


type CitationData = {
  name: string; // year
  value: number; // total citations that year
};

export async function getDoisFromOrcid(orcidId: string): Promise<string[]> {
  try {
    const res = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error(`ORCID API error: ${res.status}`);
    const data = await res.json();
    const groups = data.group || [];

    const dois: string[] = [];

    groups.forEach((group: any) => {
      const workSummary = group["work-summary"]?.[0];
      const ids = workSummary?.["external-ids"]?.["external-id"];

      ids?.forEach((id: any) => {
        if (id["external-id-type"] === "doi") {
          const doi = id["external-id-value"];
          if (doi) dois.push(doi.toLowerCase());
        }
      });
    });

    return dois;
  } catch (error) {
    console.error("Failed to fetch DOIs from ORCID", error);
    return [];
  }
}

export async function getCitationsByYearFromCrossref(doi: string): Promise<Record<string, number>> {
  try {
    const encodedDoi = encodeURIComponent(doi);
    const res = await fetch(`https://opencitations.net/index/coci/api/v1/citations/${encodedDoi}`);

    if (!res.ok) throw new Error(`OpenCitations error: ${res.status}`);
    const data = await res.json();

    const yearMap: Record<string, number> = {};

    data.forEach((citation: any) => {
      const year = citation?.citing_publication_date;
      if (year) {
        yearMap[year] = (yearMap[year] || 0) + 1;
      }
    });

    return yearMap;
  } catch (error) {
    console.error(`Failed to fetch citation data for DOI: ${doi}`, error);
    return {};
  }
}

export async function getAggregatedCitationsByYearFromOrcid(orcidId: string): Promise<CitationData[]> {
  const dois = await getDoisFromOrcid(orcidId);
  const uniqueDois = [...new Set(dois)];
  console.log(`Found ${uniqueDois.length} unique publications with DOIs.`);


  // --- Step B: Fetch publication year and citation count for each DOI from Crossref ---
  const crossrefPromises = uniqueDois.map((doi: string) =>
    fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`)
    .then(res => res.ok ? res.json() : null)
    .catch(err => {
        console.error(`Error fetching DOI ${doi}:`, err);
        return null; // Ignore errors for single DOIs
    })
  );
  
  // Wait for all Crossref requests to settle
  const crossrefResults = await Promise.allSettled(crossrefPromises);
  console.log('Fetched all data from Crossref.');


  // --- Step C: Aggregate the data by publication year ---
  const yearlyStats = new Map<number, number>(); // Map<year, totalCitations>

  crossrefResults.forEach(result => {
    // Check if the promise was fulfilled and we got a valid response
    if (result.status === 'fulfilled' && result.value) {
      const work = result.value.message;
      const year = work.published?.['date-parts']?.[0]?.[0];
      const citations = work['is-referenced-by-count'] || 0;

      if (year) {
        const currentCitations = yearlyStats.get(year) || 0;
        yearlyStats.set(year, currentCitations + citations);
      }
    }
  });

  // --- Step D: Format the data into the desired structure and sort ---
  const formattedData: ChartDataPoint[] = Array.from(yearlyStats.entries())
    .map(([year, totalCitations]) => ({
      name: String(year),
      value: totalCitations,
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Sort chronologically

  console.log('Data processing complete.');
  return formattedData;
}

export default function Visualizations() {
  const [researcherId, setResearcherId] = useState("");
  const [visualization, setVisualization] = useState("overview");
  const [publicationsData, setPublicationsData] = useState<PublicationData[]>([]);
  const [citationsData, setCitationsData] = useState<CitationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isValidOrcidFormat = (id: string): Promise<boolean> => {
    // Return false if the input is null, undefined, or not a string
    if (!id) {
      return false;
    }
  
    // The core pattern for an ORCID iD is 4 groups of 4 characters,
    // separated by hyphens. The last character can be a digit or 'X'.
    const orcidPattern = /^(\d{4}-){3}\d{3}[\dX]$/;
  
    let potentialId = id;
  
    // If the ID is a URL, extract the ID part from the end.
    const urlPrefix = "https://orcid.org/";
    if (potentialId.startsWith(urlPrefix)) {
      potentialId = potentialId.substring(urlPrefix.length);
    }
  
    // Test the potential ID against the regular expression.
    return orcidPattern.test(potentialId);
  };
  const handleGenerateClick = async () => {
    if (!researcherId) {
      setError("Por favor, insira um ID ORCID do pesquisador.");
      return;
    }

    if(isValidOrcidFormat(researcherId) == false) {
      console.log("dentro");
      setError("Por favor, insira um ID ORCID válido");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    
    // Clear previous results
    setPublicationsData([]);
    setCitationsData([]);
  
    try {
      // Call both your data fetching functions at the same time
      const [pubs, cites] = await Promise.all([
        getPublicationsDataByYear(researcherId),
        getAggregatedCitationsByYearFromOrcid(researcherId)
      ]);
  
      setPublicationsData(pubs);
      setCitationsData(cites);
  
      if (pubs.length === 0 && cites.length === 0) {
          setError("Nenhum dado encontrado para este ORCID. Verifique o ID e tente novamente.");
      }
  
    } catch (err) {
      console.error("Failed to fetch visualization data", err);
      setError("Ocorreu um erro ao buscar os dados. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Visualizações</h1>

        <Card className="mb-8 border border-border/50">
          <CardContent className="p-6">
            <div className="gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                    Pesquisador
                </label>
                <div className="relative">
                  <Input
                    placeholder="Digite o ID ORCID do pesquisador..."
                    className="pl-10"
                    value={researcherId}
                    onChange={(e) => setResearcherId(e.target.value)}
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={handleGenerateClick} disabled={isLoading}>
                {isLoading ? "Gerando..." : "Gerar Visualizações"}
              </Button>
            </div>
                <p style={{ color: 'red' }}>{error}</p>
          </CardContent>
        </Card>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GraphCard
            title="Publicações por Ano"
            type="bar"
            data={publicationsData}
          />
          <GraphCard
            title="Citações por Ano de Publicação"
            type="line"
            data={citationsData}
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
                  <p className="text-3xl font-bold">{publicationsData.reduce((total, year) => total + year.value, 0)}</p>
                  <p className="text-sm text-muted-foreground">
                    Total de publicações
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-md">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Citações</h4>
                  </div>
                  <p className="text-3xl font-bold">{citationsData.reduce((total, year) => total + year.value, 0)}</p>
                  <p className="text-sm text-muted-foreground">
                    Total de citações
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
