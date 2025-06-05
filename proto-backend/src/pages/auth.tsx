// Sua página de autenticação, ex: pages/auth.js ou o AuthPage.js que você tinha
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// SDK do Appwrite e serviço Avatars
import { account, client } from '@/lib/appwrite'; // AJUSTE O CAMINHO para seu arquivo de config do Appwrite
import { Avatars } from 'appwrite';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Ajuste o caminho se necessário
import { Button } from "@/components/ui/button"; // Ajuste o caminho se necessário
import { useToast } from "@/hooks/use-toast"; // Se você ainda quiser usar toasts

// Se você estiver usando o Layout na página de autenticação, importe-o
// import Layout from "@/components/layout/Layout";

export default function AuthPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const avatars = new Avatars(client); // Inicializa o serviço Avatars

  // Efeito para verificar a sessão do Appwrite ao carregar a página
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
        // Não é necessariamente um erro se não houver sessão, apenas usuário não logado
        // console.info("Nenhuma sessão ativa do Appwrite encontrada.");
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Verificar se houve erro no callback do OAuth vindo do Appwrite
  useEffect(() => {
    if (router.query.error) {
      toast({
        title: "Erro de Autenticação",
        description: "Ocorreu um problema durante o login com o Google. Tente novamente.",
        variant: "destructive",
      });
      // Limpar o query param de erro da URL para não mostrar o toast novamente em reloads
      router.replace('/auth', undefined, { shallow: true });
    }
  }, [router.query, router, toast]);


  const handleGoogleSignIn = async () => {
    try {
      // URL para onde o Appwrite irá redirecionar após o login bem-sucedido (via servidor Appwrite)
      // Esta deve ser uma página na sua aplicação Next.js
      const successUrl = `${window.location.origin}/auth`; // Volta para esta página de autenticação
      const failureUrl = `${window.location.origin}/auth?error=oauth_failed`; // Volta para esta página com um parâmetro de erro

      await account.createOAuth2Session('google', successUrl, failureUrl);
      // O Appwrite irá redirecionar o usuário para o Google,
      // depois o Google para o servidor Appwrite,
      // e então o servidor Appwrite para a successUrl ou failureUrl.
      // A página será recarregada, e o useEffect acima pegará a sessão.
    } catch (error) {
      console.error("Falha ao iniciar o login com Google via Appwrite:", error);
      toast({
        title: "Erro ao Iniciar Login",
        description: "Não foi possível iniciar o processo de login com o Google.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      toast({
        title: "Logout Realizado",
        description: "Você foi desconectado com sucesso.",
      });
      // Opcional: redirecionar se esta página só deve ser vista por usuários logados em algum estado
      // router.push('/');
    } catch (error) {
      console.error("Falha ao fazer logout com Appwrite:", error);
      toast({
        title: "Erro no Logout",
        description: "Não foi possível realizar o logout.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      // <Layout> // Se estiver usando Layout
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <p className="text-lg">Carregando sessão...</p>
          {/* Você pode adicionar um spinner aqui */}
          {/* Ex: <svg className="animate-spin h-8 w-8 text-primary mt-4" ... /> */}
        </div>
      // </Layout>
    );
  }

  // Se o usuário já estiver autenticado via Appwrite
  if (currentUser) {
    // Obter avatar do Gravatar (ou outro, se configurado no Appwrite)
    let userAvatarUrl = null;
    try {
        // Se o email estiver disponível, tentamos pegar o Gravatar
        if (currentUser.email) {
            userAvatarUrl = avatars.getGravatar(currentUser.email, 96, 'mp').toString(); // 96px, 'mp' como fallback
        }
    } catch (e) {
        console.warn("Não foi possível gerar URL do Gravatar:", e);
    }

    return (
      // <Layout>
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="flex-shrink-0 inline-flex items-center mb-4">
              <span className="text-primary font-bold text-3xl">Orquídea</span>
            </Link>
            <h1 className="text-2xl font-bold">Bem-vindo(a) de volta!</h1>
            {userAvatarUrl && ( // Verifica se a URL do avatar foi obtida
                <img
                    src={userAvatarUrl}
                    alt={`Foto de ${currentUser.name || 'usuário'}`}
                    className="w-24 h-24 rounded-full mx-auto my-4 border-2 border-primary bg-gray-200" // Adicionado bg-gray-200 para placeholder visual
                />
            )}
            <p className="text-muted-foreground mt-2">
              Você está conectado como <span className="font-semibold">{currentUser.name || currentUser.email}</span>.
            </p>
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">Sua Conta</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p>O que você gostaria de fazer?</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button onClick={() => router.push('/')} className="w-full">
                Ir para a Home
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                Sair (Logout)
              </Button>
            </CardFooter>
          </Card>
        </div>
      // </Layout>
    );
  }

  // Se o usuário não estiver autenticado, mostre o botão de login
  return (
    // <Layout>
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="flex-shrink-0 inline-flex items-center mb-4">
            <span className="text-primary font-bold text-3xl">Orquídea</span>
          </Link>
          <h1 className="text-2xl font-bold">Bem-vindo ao Projeto Orquídea</h1>
          <p className="text-muted-foreground mt-2">
            Acesse sua conta utilizando o Google.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Login / Criar Conta</CardTitle>
            <CardDescription>
              Use sua conta do Google para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Conteúdo do card pode ser removido se for apenas o botão no footer */}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <svg // Ícone do Google
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continuar com Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    // </Layout>
  );
}