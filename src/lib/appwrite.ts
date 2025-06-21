// Exemplo: lib/appwrite.js
import { Client, Account } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Váriavel de ambiente
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Váriavel de ambiente

export const account = new Account(client);
export { client }; // Exporte o client se precisar do serviço Avatars ou outros