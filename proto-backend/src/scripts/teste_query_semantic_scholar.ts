// Arquivo: scripts/testarSemanticScholar.ts

// Importa a função e os tipos necessários do seu arquivo de query
// Ajuste o caminho ('../lib/...') se a sua estrutura de pastas for diferente.
// Este caminho assume que 'scripts' e 'lib' estão no mesmo nível (raiz do projeto).
import { 
    fetchSemanticScholarData, 
    type SemanticScholarData, 
    // Se SemanticScholarAuthor e SemanticScholarPaperSummary forem usados diretamente no log, importe-os também
    // ou confie na tipagem inferida de SemanticScholarData.author.
} from '../lib/profile_info_query_secondary'; 

// Função de teste auto-executável
(async function testMySemanticScholarFetch() {
  // ORCID iD para testar.
  // O ID "0000-0003-1574-0784" resultou em 404 anteriormente (autor não encontrado no Semantic Scholar).
  // O ID "0000-0002-1825-0097" é um exemplo de perfil de teste (Josiah Carberry) que geralmente é encontrado.
  const orcidIdParaTestar = "0000-0003-1574-0784"; 
  // const orcidIdParaTestar = "0000-0002-1825-0097"; // Descomente para testar um ID diferente

  console.log(`\n--- Testando Semantic Scholar para ORCID iD: ${orcidIdParaTestar} ---`);
  
  try {
    // Chama a função importada
    const dados: SemanticScholarData = await fetchSemanticScholarData(orcidIdParaTestar);
    
    console.log("\nDados brutos recebidos do Semantic Scholar:");
    console.log(JSON.stringify(dados, null, 2)); // Loga o objeto completo { author: ... }

    if (dados.author) {
      console.log("\n--- Detalhes do Autor ---");
      console.log("Nome:", dados.author.name);
      console.log("H-Index:", dados.author.hIndex);
      console.log("Contagem de Citações (Autor):", dados.author.citationCount);
      console.log("Número de Publicações encontradas:", dados.author.papers?.length);
      if (dados.author.papers && dados.author.papers.length > 0) {
        console.log("Detalhes da primeira publicação:", JSON.stringify(dados.author.papers[0], null, 2));
      }
    } else if (dados.author === null) { 
      console.log("Nenhum autor encontrado no Semantic Scholar para este ORCID iD (retorno tratado como nulo pela função fetch).");
    }

  } catch (error) {
    // A função fetchSemanticScholarData agora trata o 404 retornando { author: null }
    // e não relançando o erro, então este catch pode não ser atingido para 404.
    // Ele ainda é útil para outros erros de rede ou problemas inesperados.
    if (error instanceof Error) {
        console.error("\nErro detalhado no teste da função fetchSemanticScholarData:", error.message);
    } else {
        console.error("\nErro desconhecido no teste da função fetchSemanticScholarData:", error);
    }
  }
})();
