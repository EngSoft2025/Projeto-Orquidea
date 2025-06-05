// Sua página de autenticação, ex: pages/auth.js ou o AuthPage.js que você tinha
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Ajuste o caminho se necessário
import { Button } from "@/components/ui/button"; // Ajuste o caminho se necessário
import { useToast } from "@/hooks/use-toast"; // Se você ainda quiser usar toasts
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router'; // Para redirecionamento pós-login, se necessário

// Se você estiver usando o Layout na página de autenticação, importe-o
// import Layout from "@/components/layout/Layout";

export default function AuthPage() {
  const { data: session, status } = useSession(); // status pode ser 'loading', 'authenticated', 'unauthenticated'
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" }); // Redireciona para a home "/" após o login bem-sucedido
    // Você pode mudar callbackUrl para outra página, ex: "/dashboard"
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth" }); // Redireciona para a página de autenticação após o logout
  };

  if (status === "loading") {
    return (
      // <Layout> // Se estiver usando Layout
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <p className="text-lg">Carregando sessão...</p>
          {/* Você pode adicionar um spinner aqui */}
        </div>
      // </Layout>
    );
  }

  // Se o usuário já estiver autenticado
  if (session) {
    return (
      // <Layout>
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="flex-shrink-0 inline-flex items-center mb-4">
              <span className="text-primary font-bold text-3xl">Orquídea</span>
            </Link>
            <h1 className="text-2xl font-bold">Bem-vindo(a) de volta!</h1>
            {session.user?.image && (
                <img
                    src={session.user.image}
                    alt={`Foto de ${session.user.name || 'usuário'}`}
                    className="w-24 h-24 rounded-full mx-auto my-4 border-2 border-primary"
                />
            )}
            <p className="text-muted-foreground mt-2">
              Você está conectado como <span className="font-semibold">{session.user?.name || session.user?.email}</span>.
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