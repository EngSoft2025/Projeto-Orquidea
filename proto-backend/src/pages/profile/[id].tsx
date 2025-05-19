import { useState } from "react";
import {
  CalendarIcon,
  Clock,
  Filter,
  BookOpen,
  FileText,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PublicationCard from "@/components/profile/PublicationCard";
import { useRouter } from "next/router";

// Mock data
const profile = {
  id: "0000-0002-3456-7890",
  name: "Carlos Eduardo Martins",
  institution: "Universidade Federal do Rio de Janeiro",
  department: "Departamento de Física",
  position: "Professor Titular",
  orcidId: "0000-0002-3456-7890",
  publicationsCount: 112,
  citationsCount: 3476,
  hIndex: 32,
  areas: ["Física Quântica", "Nanotecnologia", "Computação Quântica"],
};

const publications = [
  {
    id: "10.5678/efgh.5678",
    title:
      "Novel approaches in quantum computing for solving optimization problems",
    authors: ["Carlos Eduardo Martins", "James Wilson", "Robert Johnson"],
    journal: "Quantum Information Processing",
    year: 2023,
    doi: "10.5678/efgh.5678",
    citationCount: 8,
    type: "article",
  },
  {
    id: "10.1234/abcd.5678",
    title: "Quantum algorithms for machine learning applications",
    authors: ["Carlos Eduardo Martins", "Ana Silva", "John Smith"],
    journal: "Nature Quantum Information",
    year: 2022,
    doi: "10.1234/abcd.5678",
    citationCount: 23,
    type: "article",
  },
  {
    id: "10.9876/ijkl.4321",
    title: "Superconducting qubits: advances and challenges",
    authors: ["Carlos Eduardo Martins", "Maria Fernandez"],
    journal: "Physical Review Letters",
    year: 2021,
    doi: "10.9876/ijkl.4321",
    citationCount: 45,
    type: "article",
  },
  {
    id: "10.5432/mnop.9876",
    title:
      "Quantum error correction in noisy intermediate-scale quantum devices",
    authors: [
      "Carlos Eduardo Martins",
      "Robert Johnson",
      "James Wilson",
      "Ana Silva",
    ],
    journal: "IEEE Transactions on Quantum Engineering",
    year: 2021,
    doi: "10.5432/mnop.9876",
    citationCount: 19,
    type: "article",
  },
  {
    id: "10.8765/qrst.2109",
    title: "Quantum Supremacy: Experimental Demonstration",
    authors: ["James Wilson", "Carlos Eduardo Martins", "Sarah Connor"],
    journal: "Science",
    year: 2020,
    doi: "10.8765/qrst.2109",
    citationCount: 87,
    type: "article",
  },
];

const coauthors = [
  { name: "James Wilson", count: 3 },
  { name: "Ana Silva", count: 2 },
  { name: "Robert Johnson", count: 2 },
  { name: "Maria Fernandez", count: 1 },
  { name: "Sarah Connor", count: 1 },
  { name: "John Smith", count: 1 },
];

export default function Profile() {
  const router = useRouter();
  const id = router.query.id as string;
  const [activeTab, setActiveTab] = useState("publications");
  const [yearFilter, setYearFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter publications based on search query and year filter
  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.some((author) =>
        author.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (yearFilter === "all") return matchesSearch;
    return matchesSearch && pub.year.toString() === yearFilter;
  });

  const years = Array.from(new Set(publications.map((pub) => pub.year))).sort(
    (a, b) => b - a
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        id={profile.id}
        name={profile.name}
        institution={profile.institution}
        department={profile.department}
        position={profile.position}
        orcidId={profile.orcidId}
        publicationsCount={profile.publicationsCount}
        citationsCount={profile.citationsCount}
        hIndex={profile.hIndex}
        areas={profile.areas}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="publications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Publicações
          </TabsTrigger>
          <TabsTrigger value="citations" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Citações
          </TabsTrigger>
          <TabsTrigger value="coauthors" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Coautores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="publications" className="mt-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                placeholder="Buscar publicações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>

            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPublications.length > 0 ? (
              filteredPublications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  id={publication.id}
                  title={publication.title}
                  authors={publication.authors}
                  journal={publication.journal}
                  year={publication.year}
                  doi={publication.doi}
                  citationCount={publication.citationCount}
                  type={publication.type as any}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma publicação encontrada com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="citations" className="mt-0">
          <div className="bg-secondary p-8 rounded-lg text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Dados de Citação em Processamento
            </h3>
            <p className="text-muted-foreground mb-4">
              Os dados detalhados de citações estão sendo processados e estarão
              disponíveis em breve.
            </p>
            <div className="max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-2">
                Total de citações:{" "}
                <span className="font-semibold">{profile.citationsCount}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                h-index: <span className="font-semibold">{profile.hIndex}</span>
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coauthors" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coauthors.map((coauthor, index) => (
              <div
                key={index}
                className="p-4 border border-border/50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{coauthor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {coauthor.count}{" "}
                    {coauthor.count === 1 ? "publicação" : "publicações"} em
                    comum
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Perfil
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
