
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("researcher");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscar por:", searchQuery, "Tipo:", searchType);
    // Implementaria a lógica de busca real aqui
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-[180px]">
          <Select 
            value={searchType} 
            onValueChange={setSearchType}
          >
            <SelectTrigger className="bg-white dark:bg-gray-900">
              <SelectValue placeholder="Buscar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="researcher">Pesquisador</SelectItem>
              <SelectItem value="publication">Publicação</SelectItem>
              <SelectItem value="institution">Instituição</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative flex-grow">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite sua busca..."
            className="pl-10 search-input h-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
        
        <Button type="submit" className="h-10 px-8">
          Buscar
        </Button>
      </div>
    </form>
  );
}
