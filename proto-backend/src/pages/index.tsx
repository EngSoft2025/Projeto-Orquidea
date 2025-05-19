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

export default function Index() {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    {
      title: "Pesquisadores",
      value: "15.243",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Publicações",
      value: "257.892",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Notificações",
      value: "1.372",
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  const features = [
    {
      title: "Busca Avançada",
      description:
        "Encontre pesquisadores e publicações utilizando filtros personalizados.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Monitoramento",
      description:
        "Receba atualizações quando houver mudanças nos perfis monitorados.",
      icon: <Bell className="h-6 w-6" />,
    },
    {
      title: "Visualizações",
      description:
        "Explore dados acadêmicos através de gráficos e visualizações interativas.",
      icon: <BarChart3 className="h-6 w-6" />,
    },
  ];

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
              <SearchBar />
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

      {/* Stats Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
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

      {/* Info Tabs Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Como Funciona
            </h2>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-border mb-6">
              <div className="flex overflow-x-auto">
                {["Busca", "Monitoramento", "Visualizações"].map(
                  (tab, index) => (
                    <button
                      key={index}
                      className={`flex-1 p-4 text-center border-b-2 ${
                        activeTab === index
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground"
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              <div className="p-6">
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Busque por pesquisadores ou publicações
                    </h3>
                    <p>
                      Utilize nossa busca avançada para encontrar pesquisadores
                      por nome, instituição ou área de atuação. Refine seus
                      resultados com filtros específicos como tipo de
                      publicação, ano e operadores lógicos (AND/OR).
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/search"
                        className="text-primary hover:underline flex items-center"
                      >
                        Ir para a busca <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Monitore atualizações em tempo real
                    </h3>
                    <p>
                      Acompanhe mudanças nos perfis dos pesquisadores, incluindo
                      novas publicações, citações e atualizações acadêmicas.
                      Configure alertas personalizados para receber notificações
                      quando houver alterações relevantes.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/monitor"
                        className="text-primary hover:underline flex items-center"
                      >
                        Configurar monitoramento{" "}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Explore visualizações interativas
                    </h3>
                    <p>
                      Analise dados acadêmicos através de gráficos interativos,
                      incluindo grafos de colaboração, redes de coautoria e
                      distribuição de publicações por instituição. Obtenha
                      insights valiosos sobre tendências de pesquisa e
                      colaborações.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/visualizations"
                        className="text-primary hover:underline flex items-center"
                      >
                        Ver visualizações{" "}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
