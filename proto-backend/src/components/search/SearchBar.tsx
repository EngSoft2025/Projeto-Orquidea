import { useEffect, useState } from "react";
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

interface SearchBarProps {
  searchQuery?: string;
  onSearch?: (query: string, type: string) => void;
}

export default function SearchBar({ searchQuery: parentSearchQuery, onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(parentSearchQuery || "");
  const [searchType, setSearchType] = useState("researcher");

  useEffect(() => {
    setSearchQuery(parentSearchQuery || "");
  }, [parentSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery, searchType);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
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
