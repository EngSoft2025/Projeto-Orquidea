import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  BookOpen,
  User,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search/SearchBar";
import FeatureCard from "@/components/home/FeatureCard";
import StatCard from "@/components/home/StatCard";
import Layout from "@/components/layout/Layout";
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "Busca de Pesquisadores",
      description:
        "Encontre o perfil ORCID de pesquisadores buscando por seu nome.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Monitoramento",
      description:
        "Receba atualizações via e-mail quando houverem mudanças nos perfis monitorados.",
      icon: <Bell className="h-6 w-6" />,
    },
    {
      title: "Visualizações",
      description:
        "Explore dados acadêmicos através de gráficos e visualizações variados, unindo dados do ORCID e do crossref.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
  ];

  const onSearch = (query: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  } 

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-bg py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Acompanhe Informações Acadêmicas com Facilidade
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              O Projeto Orquídea facilita o acesso e monitoramento de dados
              acadêmicos através do ORCID, permitindo acompanhar pesquisadores,
              publicações e citações em tempo real.
            </p>
            <div className="mb-8">
              <SearchBar  onSearch={onSearch}/>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/search">Buscar Pesquisadores</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Características Principais
            </h2>
            <p className="text-lg text-muted-foreground">
              O Projeto Orquídea oferece ferramentas poderosas para o
              acompanhamento e análise de informações acadêmicas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/search" className="flex items-center gap-2">
                Começar Agora <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Comece a monitorar informações acadêmicas hoje mesmo
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Cadastre-se gratuitamente e tenha acesso a todas as
              funcionalidades do Projeto Orquídea.
            </p>
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/auth">Criar Conta Gratuita</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
