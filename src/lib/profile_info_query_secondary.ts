// --- ORCID API Types and Function ---

interface OrcidName {
    value: string;
  }
  
  interface OrcidGivenNames extends OrcidName {}
  interface OrcidFamilyName extends OrcidName {}
  interface OrcidCreditName extends OrcidName {}
  
  interface OrcidPersonName {
    'given-names': OrcidGivenNames | null;
    'family-name': OrcidFamilyName | null;
    'credit-name': OrcidCreditName | null;
    path: string; 
  }
  
  interface OrcidOrganization {
    name: string;
    address: {
      city: string | null;
      region: string | null;
      country: string; 
    };
    'disambiguated-organization'?: { 
      'disambiguated-organization-identifier': string; 
      'disambiguation-source': string;
    } | null;
  }
  
  export interface OrcidAffiliation { // Exportando para uso na página de perfil
    type: string; 
    'department-name': string | null;
    'role-title': string | null;
    'start-date': {
      year: OrcidName | null;
      month?: OrcidName | null;
      day?: OrcidName | null;
    } | null;
    'end-date': {
      year: OrcidName | null;
      month?: OrcidName | null;
      day?: OrcidName | null;
    } | null;
    organization: OrcidOrganization;
    'source-client-id': any | null; 
    'last-modified-date': { value: number };
    'created-date': { value: number };
    'put-code': number;
    path: string;
    visibility: string; 
  }
  
  interface OrcidPublicationDate {
    year: OrcidName;
    month?: OrcidName | null;
    day?: OrcidName | null;
  }
  
  export interface OrcidExternalId { // Exportando para uso
    'external-id-type': string; 
    'external-id-value': string;
    'external-id-url': OrcidName | null;
    'external-id-relationship': string; // SELF, PART_OF
  }
  
  interface OrcidWorkContributorAttributes {
      'contributor-role': string; 
  }
  interface OrcidWorkContributor {
      'contributor-orcid': {
          uri: string;
          path: string; 
          host: string;
      } | null;
      'credit-name': OrcidName | null; 
      'contributor-email': any | null; 
      'contributor-attributes': OrcidWorkContributorAttributes | null;
  }
  
  export interface OrcidWorkSummary { // Exportando para uso na página de perfil
    'put-code': number;
    'last-modified-date': { value: number };
    'created-date': { value: number };
    source: any; 
    title: {
      title: OrcidName;
      subtitle: OrcidName | null;
      'translated-title': any | null; 
    } | null;
    'journal-title': OrcidName | null;
    'short-description': string | null;
    'citation': {
      'citation-type': string; 
      'citation-value': string;
    } | null;
    type: string; 
    'publication-date': OrcidPublicationDate | null;
    'external-ids': {
      'external-id': OrcidExternalId[];
    } | null;
    url: OrcidName | null;
    contributors?: { 
        contributor: OrcidWorkContributor[];
    };
    visibility: string;
    path: string; 
    'display-index': string; 
  }
  
  interface OrcidWorksGroup {
    'last-modified-date': { value: number };
    'external-ids': { 'external-id': OrcidExternalId[] };
    'work-summary': OrcidWorkSummary[];
  }
  
  export interface OrcidResearcherUrl { // Exportando para uso
      "created-date": { value: number };
      "last-modified-date": { value: number };
      "source": any;
      "url-name": string | null;
      "url": OrcidName;
      "visibility": string;
      "path": string;
      "put-code": number;
      "display-index": number;
  }
  
  export interface OrcidExternalIdentifier { // Exportando para uso
      "created-date": { value: number };
      "last-modified-date": { value: number };
      "source": any;
      "external-id-type": string;
      "external-id-value": string;
      "external-id-url": OrcidName | null;
      "external-id-relationship": string | null; // "self" or "part-of"
      "visibility": string;
      "path": string;
      "put-code": number;
      "display-index": number;
  }
  
  interface OrcidActivities {
    'last-modified-date': { value: number };
    educations?: {
      'last-modified-date': { value: number };
      'affiliation-group': Array<{ summaries: Array<{ 'education-summary': OrcidAffiliation }> }> | Array<{ 'education-summary': OrcidAffiliation }>;
      path: string;
    };
    employments?: {
      'last-modified-date': { value: number };
      'affiliation-group': Array<{ summaries: Array<{ 'employment-summary': OrcidAffiliation }> }> | Array<{ 'employment-summary': OrcidAffiliation }>;
      path: string;
    };
    works?: {
      'last-modified-date': { value: number };
      group: OrcidWorksGroup[];
      path: string; 
    };
  }
  
  interface OrcidPerson {
    'last-modified-date': { value: number };
    name: OrcidPersonName | null;
    'other-names': { 
      'last-modified-date': { value: number } | null;
      'other-name': Array<{
        content: string;
        visibility: string;
        source: any;
        'put-code': number;
        path: string;
        'display-index': number;
      }>;
      path: string;
    } | null;
    biography: { 
      'last-modified-date': { value: number };
      content: string | null; 
      visibility: string;
      path: string;
    } | null;
    'researcher-urls'?: { // Tornando opcional para segurança
      'last-modified-date': { value: number };
      'researcher-url': OrcidResearcherUrl[];
      path: string;
    };
    keywords?: { // Tornando opcional
      'last-modified-date': { value: number };
      keyword: Array<{
          content: string;
          // ... outros campos de keyword
      }>;
      path: string;
    };
    'external-identifiers'?: { // Tornando opcional
      'last-modified-date': { value: number };
      'external-identifier': OrcidExternalIdentifier[];
      path: string;
    };
  }
  
  export interface OrcidFullRecord { // Exportando para uso na página de perfil
    'orcid-identifier': {
      uri: string;
      path: string; 
      host: string;
    };
    preferences: any; 
    history: any; 
    person: OrcidPerson;
    'activities-summary': OrcidActivities | null; 
    path: string; 
  }
  
  export async function fetchOrcidProfile(
    orcidId: string
  ): Promise<OrcidFullRecord> {
    if (!orcidId) {
      console.error("ORCID iD é necessário para buscar o perfil.");
      throw new Error("ORCID iD é necessário.");
    }
  
    const url = new URL(`https://pub.orcid.org/v3.0/${orcidId}/record`);
    // console.log(`Fetching ORCID profile from: ${url.toString()}`);
  
    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json", 
        },
      });
  
      if (!response.ok) {
        const errorBody = await response.text(); 
        console.error(`Error fetching ORCID profile for ${orcidId}: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(
          `Erro ao buscar dados do ORCID para ${orcidId}: ${response.status} ${response.statusText}`
        );
      }
  
      const data: OrcidFullRecord = await response.json();
      // console.log(`Successfully fetched ORCID profile data for ${orcidId}:`, data);
      return data;
    } catch (error) {
      console.error(`Falha ao buscar perfil do ORCID para ${orcidId}:`, error);
      if (error instanceof Error) {
          throw new Error(`Falha na requisição para o ORCID: ${error.message}`);
      }
      throw new Error("Ocorreu um erro desconhecido ao buscar o perfil do ORCID.");
    }
  }
  
  
  // --- Semantic Scholar API Types and Function ---
  
  interface SemanticScholarAuthor {
    authorId: string;
    name: string;
    hIndex: number | null;
    citationCount: number | null; // Contagem total de citações do autor
    papers: SemanticScholarPaperSummary[];
    // Adicionar outros campos se necessário (url, affiliations, etc.)
  }
  
  interface SemanticScholarPaperAuthor {
      authorId: string | null;
      name: string;
  }
  
  interface SemanticScholarPaperExternalIds {
      DOI?: string;
      // Outros IDs como ArXiv, MAG, ACL, PubMed, CorpusId
  }
  
  interface SemanticScholarPaperSummary {
      paperId: string;
      title: string;
      authors: SemanticScholarPaperAuthor[];
      year: number | null;
      citationCount: number | null; // Citações desta publicação específica
      externalIds: SemanticScholarPaperExternalIds | null;
      // Adicionar outros campos se necessário (venue, publicationTypes, etc.)
  }
  
  export interface SemanticScholarData {
    author: SemanticScholarAuthor | null;
    // Você pode adicionar mais informações aqui se buscar por publicações específicas também
  }
  
  /**
   * Busca dados de um autor no Semantic Scholar usando o ORCID iD.
   * @param orcidId O ORCID iD do pesquisador.
   * @returns Uma Promise com os dados do Semantic Scholar.
   */
  export async function fetchSemanticScholarData(
    orcidId: string
  ): Promise<SemanticScholarData> {
    if (!orcidId) {
      console.warn("Semantic Scholar: ORCID iD é necessário para buscar dados do autor.");
      return { author: null }; // Retorna um objeto indicando que não houve busca
    }
  
    // A API do Semantic Scholar usa ORCID: seguido pelo ID.
    const apiUrl = `https://api.semanticscholar.org/graph/v1/author/ORCID:${orcidId}?fields=name,hIndex,citationCount,papers.title,papers.authors,papers.year,papers.citationCount,papers.externalIds`;
    // console.log(`Fetching Semantic Scholar data from: ${apiUrl}`);
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          // A API do Semantic Scholar não requer 'Accept' para JSON por padrão, mas não custa manter.
          // Chaves de API podem ser necessárias para taxas de requisição mais altas, mas não para buscas básicas.
          // 'x-api-key': 'SUA_CHAVE_API_SEMANTIC_SCHOLAR' // Se você tiver uma
        },
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Semantic Scholar: Autor com ORCID ${orcidId} não encontrado (404).`);
          return { author: null }; // Retorna nulo se o autor não for encontrado
        }
        const errorBody = await response.text();
        console.error(`Error fetching Semantic Scholar data for ORCID ${orcidId}: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(
          `Erro ao buscar dados do Semantic Scholar para ORCID ${orcidId}: ${response.status} ${response.statusText}`
        );
      }
  
      const data: SemanticScholarAuthor = await response.json();
      // console.log(`Successfully fetched Semantic Scholar data for ORCID ${orcidId}:`, data);
      return { author: data };
  
    } catch (error) {
      console.error(`Falha ao buscar dados do Semantic Scholar para ORCID ${orcidId}:`, error);
       if (error instanceof Error) {
          // Não relance o erro para não quebrar a página de perfil se o Semantic Scholar falhar.
          // A página pode funcionar com os dados do ORCID e apenas indicar que métricas S2 não estão disponíveis.
          console.warn(`Semantic Scholar fetch failed, returning null: ${error.message}`);
          return { author: null };
      }
      return { author: null }; // Retorno padrão em caso de erro desconhecido
    }
  }
  
