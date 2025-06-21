# Trabalho ORCID

Documentação para a realização do Trabalho da Disciplina SCC0130 - Engenharia de Software, ministrada pelo Prof. Dr. Seiji Isotani.

### Grupo: Um time aí

| NOME | NUSP |
|------|------|
| Hélio Márcio Cabral Santos | 14577862 |
| Andrey Cortez Rufino | 11819487
| Antônio Italo Lima Lopes | 12542290
| Gabriel Martins Monteiro | 14572099
| Jean Patrick Ngandu Mamani | 14712678

## 1. Introdução

O projeto Orquidea foi desenvolvido usando o método kanban, usando o próprio quadro disponivel no github (é possível acompanhar na página de projetos) e a interação entre os membros do grupo foi feita de forma assíncrona. Usamos os relatos de 3 diferentes professores como fonte de inspiração de quais problemas deveriamos buscar resolver, conforme descrito no documentos do projeto.

## 2. Objetivo

Nosso trabalho tem como objetivo principal criar uma ferramenta que facilite o uso do ORCID, com o principal foco da aplicação sendo facilitar a busca e visualização dos dados. Além disso, oferecemos tambem a possibilidade de acompanhar e receber notificações sempre que novas publicações dos pesquisadores desejados forem feitas.

## 3. Funcionalidades

O projeto conta com três funcionalidades principais:

### 3.1 Busca

Nosso sistema de buscas é uma melhoria direta da busca presente nativamente no ORCID, ela permite que o usuário encontre com facilidade pesquisadores desejados e possa olhar seu perfil e publicações, como nas imagens:

### 3.2 Monitoramento

O nosso sistema de monitoramento possibilita o acompanhamento das publicações de pesquisadores, enviando semanalmente para o email do usuário notificações sobre os pesquisadores desejados, conforme as imagens:

### 3.3 Visualização de dados

O site conta ainda com um sistema de visualização de estatisticas para cada pesquisador, que mostra gráficos de citações e publicações por ano, além do número total delas, como mostrado das imagens a seguir:

## 4.Build
Para realizar a execução do projeto, basta seguir os seguintes passos:
### 4.1 Enviroment
Para a execução correta do projeto, dois arquivos iguais nomeados .env e .env.local devem estar na raíz do projeto.

As variáveis que devem ser salvas nos arquvios .env e .env.local são:

* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET
* NEXTAUTH_URL: A URL do site
* NEXTAUTH_SECRET: Segredo gerando para assinar tokens JWT e cookies. Pode ser gerado com openssl rand -base64 32
* NEXT_PUBLIC_APPWRITE_ENDPOINT
* NEXT_PUBLIC_APPWRITE_PROJECT_ID
* CRON_SECRET
* RESEND_API_KEY
* GMAIL_USER: Usuário usado pelo e-mail que envia notificações de monitoramento.
* GMAIL_APP_PASSWORD: Senha do e-mail usado para o envio de notificações de monitoramento.
* NEXT_PUBLIC_VAPID_PUBLIC_KEY: "Voluntary Application Server Identification" usada para o envio de notificações push.
* VAPID_PRIVATE_KEY: Parte privada da VAPID. O par pode ser gerado pelo comando pnpm generate-vapid-keys.

Essas configurações são importantes para funções diversas do app, como login com autenticação do google, envio de e-mails e envio de notificações push. Para exemplo e maior facilidade de execução durante a avaliação, nosso arquivo .env (e .env.local) foi enviado por e-mail ao professor e monitor.
### 4.2 Database
Entrar na pasta database e executar o comando "sqlite3 orquidea.db < scripts/create_db.sql".

### 4.3 Final
Em dois terminais distintos, primeiro execute "pnpm install", seguido de "pnpm dev" no mesmo terminal. Em um terminal distinto, execute "pnpm scheduler" para a execução do monitoramento de modificações. 
