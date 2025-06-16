import path from 'path';
import crypto from 'crypto';
import Database from 'better-sqlite3';
import { fetchOrcidProfile } from './profile_info_query';
import { sendUpdateEmail } from './email';

const dbPath = path.join(process.cwd(), 'src', 'database', 'orquidea.db');

/**
 * Função auxiliar para gerar um identificador consistente para uma publicação.
 * @param {object} work - O objeto de publicação (do DB ou da API)
 * @param {'db' | 'api'} source - A fonte do objeto
 * @returns {string | null} - O identificador (DOI ou Título) limpo.
 */
function getWorkIdentifier(work, source) {
    if (source === 'db') {
        // 'work' é uma linha do banco de dados: { doi, title }
        return (work.doi || work.title)?.trim() || null;
    }
    // 'work' é um objeto da API ORCID
    const doi = work['external-ids']?.['external-id']?.find(id => id['external-id-type'] === 'doi')?.['external-id-value'];
    const title = work.title?.title?.value;
    return (doi || title)?.trim() || null;
}


export async function checkAllResearchersForUpdates() {
    console.log(`[${new Date().toISOString()}] Iniciando verificação de atualizações...`);
    const db = new Database(dbPath);
    
    try {
        const researchers = db.prepare('SELECT orcid_id, name, hash_trabalhos FROM Researchers').all();
        console.log(`Encontrados ${researchers.length} pesquisadores para verificar.`);

        for (const researcher of researchers) {
            console.log(`\nVerificando pesquisador: ${researcher.name} (${researcher.orcid_id})`);
            
            const freshProfileData = await fetchOrcidProfile(researcher.orcid_id);
            const freshWorks = freshProfileData['activities-summary']?.works?.group.flatMap(g => g['work-summary']) || [];
            
            console.log(`  -> Encontrados ${freshWorks.length} trabalhos no perfil ORCID.`);
            
            if (freshWorks.length === 0) {
                console.log(`  -> Nenhum trabalho encontrado. Pulando.`);
                continue;
            }

            const publicationIdentifiers = freshWorks
                .map(p => getWorkIdentifier(p, 'api'))
                .filter(Boolean).sort().join('|');
            const newHash = crypto.createHash('sha256').update(publicationIdentifiers).digest('hex');

            if (newHash !== researcher.hash_trabalhos) {
                console.log(`  -> Hash diferente detectado. Processando...`);

                const updateTransaction = db.transaction(() => {
                    const getPublicationStmt = db.prepare('SELECT doi, title FROM Publications p JOIN Authorship a ON p.id = a.publication_id WHERE a.researcher_orcid_id = ?');
                    const existingPublications = getPublicationStmt.all(researcher.orcid_id);
                    
                    console.log(`  -> Encontrados ${existingPublications.length} trabalhos para este pesquisador no DB.`);

                    // --- INÍCIO DA NOVA LÓGICA DE FILTRAGEM (FORÇA-BRUTA) ---
                    console.log("\n--- Realizando comparação manual 1 por 1... ---");

                    const newPublications = freshWorks.filter(freshWork => {
                        const freshIdentifier = getWorkIdentifier(freshWork, 'api');
                        if (!freshIdentifier) return false;

                        // Para cada trabalho da API, procure um correspondente no array do DB
                        const foundInDb = existingPublications.find(existingPub => {
                            const existingIdentifier = getWorkIdentifier(existingPub, 'db');
                            return existingIdentifier === freshIdentifier;
                        });

                        // Se 'foundInDb' for undefined, o trabalho é novo.
                        return !foundInDb;
                    });
                    
                    console.log("--- Comparação manual concluída. ---");
                    // --- FIM DA NOVA LÓGICA DE FILTRAGEM ---

                    if (newPublications.length > 0) {
                        console.log(`  -> SUCESSO! Identificadas ${newPublications.length} novas publicações.`);
                        
                        const publicationInsertStmt = db.prepare('INSERT OR IGNORE INTO Publications (doi, title) VALUES (?, ?)');
                        const authorshipStmt = db.prepare('INSERT OR IGNORE INTO Authorship (researcher_orcid_id, publication_id) VALUES (?, ?)');
                        const getPubByDoiStmt = db.prepare('SELECT id FROM Publications WHERE doi = ?');
                        const getPubByTitleStmt = db.prepare('SELECT id FROM Publications WHERE title = ? AND doi IS NULL');

                        for (const pub of newPublications) {
                            const doi = getWorkIdentifier({ 'external-ids': pub['external-ids'] }, 'api');
                            const title = getWorkIdentifier({ title: pub.title }, 'api');

                            if (title) {
                                publicationInsertStmt.run(doi, title);
                                let dbPub;
                                if (doi) { dbPub = getPubByDoiStmt.get(doi); } 
                                else { dbPub = getPubByTitleStmt.get(title); }

                                if (dbPub) {
                                    authorshipStmt.run(researcher.orcid_id, dbPub.id);
                                }
                            }
                        }

                        db.prepare('UPDATE Researchers SET hash_trabalhos = ? WHERE orcid_id = ?').run(newHash, researcher.orcid_id);
                        const usersToNotify = db.prepare(`SELECT U.email FROM Users U JOIN UserMonitorsResearcher UMR ON U.id = UMR.user_id WHERE UMR.researcher_orcid_id = ?`).all(researcher.orcid_id);
                        
                        if(usersToNotify.length > 0){
                            console.log(`  -> Notificando ${usersToNotify.length} usuário(s)...`);
                            for (const user of usersToNotify) {
                                sendUpdateEmail(user.email, researcher.name, newPublications as any);
                            }
                        }

                    } else {
                        console.log(`  -> Hash diferente, mas sem novas publicações encontradas. Apenas atualizando o hash.`);
                        db.prepare('UPDATE Researchers SET hash_trabalhos = ? WHERE orcid_id = ?').run(newHash, researcher.orcid_id);
                    }
                });
                updateTransaction();
            } else {
                console.log(`  -> Nenhuma alteração para ${researcher.name}.`);
            }
        }
    } catch (error) {
        console.error("Erro durante a verificação de atualizações:", error);
    } finally {
        if (db) db.close();
        console.log(`[${new Date().toISOString()}] Verificação de atualizações concluída.`);
    }
}