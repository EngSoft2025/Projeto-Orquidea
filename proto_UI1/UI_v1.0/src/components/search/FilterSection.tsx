
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function FilterSection() {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </Button>
      </div>
      
      <Card className={`border border-border/50 md:block ${showFilters ? 'block' : 'hidden'}`}>
        <CardContent className="p-4">
          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="type">
              <AccordionTrigger className="text-sm font-medium py-2">
                Tipo de Documento
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="article" />
                    <Label htmlFor="article">Artigos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="thesis" />
                    <Label htmlFor="thesis">Teses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="conference" />
                    <Label htmlFor="conference">Conferências</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="book" />
                    <Label htmlFor="book">Livros</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="year">
              <AccordionTrigger className="text-sm font-medium py-2">
                Ano de Publicação
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-years" />
                      <Label htmlFor="all-years">Todos os anos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last-year" id="last-year" />
                      <Label htmlFor="last-year">Último ano</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last-5-years" id="last-5-years" />
                      <Label htmlFor="last-5-years">Últimos 5 anos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="last-10-years" id="last-10-years" />
                      <Label htmlFor="last-10-years">Últimos 10 anos</Label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="institution">
              <AccordionTrigger className="text-sm font-medium py-2">
                Instituição
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instituição1" />
                    <Label htmlFor="instituição1">USP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instituição2" />
                    <Label htmlFor="instituição2">UNICAMP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instituição3" />
                    <Label htmlFor="instituição3">UFRJ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instituição4" />
                    <Label htmlFor="instituição4">UFMG</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="operator">
              <AccordionTrigger className="text-sm font-medium py-2">
                Operadores Lógicos
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <RadioGroup defaultValue="and">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="and" id="and-operator" />
                      <Label htmlFor="and-operator">AND (E)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="or" id="or-operator" />
                      <Label htmlFor="or-operator">OR (OU)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-4 flex flex-col space-y-2">
            <Button className="w-full">Aplicar Filtros</Button>
            <Button variant="outline" className="w-full">Limpar Filtros</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
