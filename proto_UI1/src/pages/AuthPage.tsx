
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login com:", { email, password });
    
    toast({
      title: "Login bem-sucedido",
      description: "Você foi autenticado com sucesso.",
    });
    
    // Em uma implementação real, redirecionaria para o dashboard após login
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registro com:", { name, email, password, institution });
    
    toast({
      title: "Registro bem-sucedido",
      description: "Sua conta foi criada com sucesso.",
    });
    
    // Em uma implementação real, redirecionaria ou mostraria confirmação
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Link to="/" className="flex-shrink-0 inline-flex items-center mb-4">
          <span className="text-primary font-bold text-3xl">Orquídea</span>
        </Link>
        <h1 className="text-2xl font-bold">Bem-vindo ao Projeto Orquídea</h1>
        <p className="text-muted-foreground mt-2">
          Faça login ou crie uma conta para acessar todas as funcionalidades.
        </p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link 
                      to="#" 
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">
                    Lembrar-me
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg 
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
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register" className="mt-0">
          <Card>
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Preencha suas informações para criar uma nova conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Instituição (Opcional)</Label>
                  <Input
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    Concordo com os{" "}
                    <Link 
                      to="#" 
                      className="text-primary hover:underline"
                    >
                      Termos de Serviço
                    </Link>
                    {" "}e{" "}
                    <Link 
                      to="#" 
                      className="text-primary hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Criar Conta
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg 
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
                  Cadastrar com Google
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          {activeTab === "login" ? (
            <>
              Não tem uma conta?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => setActiveTab("register")}
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => setActiveTab("login")}
              >
                Faça login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
