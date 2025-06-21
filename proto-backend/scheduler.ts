// npx tsx scheduler.ts

import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas PRIMEIRO

import cron from 'node-cron';
import { checkAllResearchersForUpdates } from './src/lib/tasks';

console.log('Agendador de tarefas iniciado. Aguardando horários programados.');

checkAllResearchersForUpdates().catch(err => {
  console.error('Houve um erro na execução agendada da tarefa:', err);
});

// Agenda a tarefa para rodar, por exemplo, a cada 2 minutos para teste
// Use '0 8 * * *' para rodar todo dia às 8h em produção
cron.schedule('*/1 * * * *', () => {
  console.log(`[${new Date().toISOString()}] Executando a tarefa agendada: verificação de pesquisadores...`);
  
  checkAllResearchersForUpdates().catch(err => {
    console.error('Houve um erro na execução agendada da tarefa:', err);
  });
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});