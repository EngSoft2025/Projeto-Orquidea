import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { account } from "@/lib/appwrite";

export default function Navbar({isLoggedIn}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const router = useRouter();

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Busca", href: "/search" },
    { name: "Monitoramento", href: "/monitor" },
    { name: "Visualizações", href: "/visualizations" },
  ];  

  // useEffect para verificar a sessão do Appwrite
  useEffect(() => {
    setIsSessionLoading(true);
    account.get()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setIsSessionLoading(false));
  }, []);
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-2xl">Orquídea</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    router.pathname === item.href
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <ThemeToggle />
              <Link href="/auth">
                <Button>{!isLoggedIn ? "Login / Registro" : "Autenticado"}</Button>
              </Link>
            </div>
          </div>
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  router.pathname === item.href
                    ? "text-primary font-medium"
                    : "text-foreground hover:text-primary",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button>Login / Registro</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
