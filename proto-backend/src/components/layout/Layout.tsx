import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";
import { useState, useMemo, useEffect } from "react";
import { account } from "@/lib/appwrite";

export default function Layout({ children }: React.PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // useEffect para verificar a sessão do Appwrite
  useEffect(() => {
    setIsSessionLoading(true);
    account.get()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setIsSessionLoading(false));
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isLoggedIn={!!currentUser}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
