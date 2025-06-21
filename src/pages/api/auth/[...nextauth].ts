// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure um ou mais provedores de autenticação
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...você pode adicionar mais provedores aqui (ex: GitHub, Facebook)
  ],
  // Opcional: Configurar páginas personalizadas
  // pages: {
  //   signIn: '/auth/signin', // Se você criar uma página de login customizada
  // },
  // Opcional: Callbacks para customizar o comportamento
  // callbacks: {
  //   async jwt({ token, account }) {
  //     // Persiste o access_token do OAuth no token se você precisar dele
  //     if (account) {
  //       token.accessToken = account.access_token;
  //     }
  //     return token;
  //   },
  //   async session({ session, token, user }) {
  //     // Envia propriedades para o cliente (ex: accessToken e id do usuário do token)
  //     session.accessToken = token.accessToken;
  //     session.user.id = token.sub; // 'sub' (subject) é geralmente o ID do usuário do provedor
  //     return session;
  //   }
  // }
  // Adicione seu NEXTAUTH_SECRET aqui se não estiver globalmente acessível (embora .env.local seja o padrão)
  // secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);