-- sqlite3 orquidea.db < scripts/create_db.sql

-- Tabela para Usuários
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE UserPushSubscriptions (
    user_id INTEGER NOT NULL,
    subscription_json TEXT NOT NULL,
    PRIMARY KEY (user_id, subscription_json),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Tabela para Pesquisadores
CREATE TABLE Researchers (
    orcid_id TEXT PRIMARY KEY,
    name TEXT NOT NULL, -- Adicionando o nome do pesquisador, essencial para exibição
    hash_trabalhos TEXT -- Para armazenar um hash da lista de trabalhos, útil para detectar mudanças
);

-- Tabela para Publicações (Trabalhos)
CREATE TABLE Publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    doi TEXT UNIQUE -- Digital Object Identifier, útil para identificar unicamente publicações
);

-- Tabela de Junção para indicar quais Usuários monitoram quais Pesquisadores (Relação Muitos-para-Muitos)
CREATE TABLE UserMonitorsResearcher (
    user_id INTEGER NOT NULL,
    researcher_orcid_id TEXT NOT NULL,
    PRIMARY KEY (user_id, researcher_orcid_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (researcher_orcid_id) REFERENCES Researchers(orcid_id) ON DELETE CASCADE
);

-- Tabela de Junção para Autoria (Pesquisadores <-> Publicações) (Relação Muitos-para-Muitos)
-- Isso permite que uma publicação tenha múltiplos autores e um pesquisador tenha múltiplas publicações.
CREATE TABLE Authorship (
    researcher_orcid_id TEXT NOT NULL,
    publication_id INTEGER NOT NULL,
    PRIMARY KEY (researcher_orcid_id, publication_id),
    FOREIGN KEY (researcher_orcid_id) REFERENCES Researchers(orcid_id) ON DELETE CASCADE,
    FOREIGN KEY (publication_id) REFERENCES Publications(id) ON DELETE CASCADE
);