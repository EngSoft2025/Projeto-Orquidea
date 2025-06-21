// Tipagem básica para a resposta do endpoint /record do ORCID.
// Esta é uma simplificação e pode precisar ser expandida com base nos dados exatos que você usará.

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
    path: string; // Normalmente o ORCID iD
  }
  
  interface OrcidOrganization {
    name: string;
    address: {
      city: string | null;
      region: string | null;
      country: string; // Geralmente um código de país, ex: "US"
    };
    'disambiguated-organization'?: { // Pode não estar sempre presente
      'disambiguated-organization-identifier': string; // Ex: ROR ID
      'disambiguation-source': string;
    } | null;
  }
  
  interface OrcidAffiliation {
    type: string; // EMPLOYMENT, EDUCATION, QUALIFICATION, INVITED_POSITION, DISTINCTION, MEMBERSHIP, SERVICE
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
    'source-client-id': any | null; // Informações sobre quem adicionou o dado
    'last-modified-date': { value: number };
    'created-date': { value: number };
    'put-code': number;
    path: string;
    visibility: string; // PRIVATE, LIMITED, PUBLIC
  }
  
  interface OrcidPublicationDate {
    year: OrcidName;
    month?: OrcidName | null;
    day?: OrcidName | null;
  }
  
  interface OrcidExternalId {
    'external-id-type': string; // doi, pmid, etc.
    'external-id-value': string;
    'external-id-url': OrcidName | null;
    'external-id-relationship': string; // SELF, PART_OF
  }
  
  interface OrcidWorkContributorName {
      'credit-name': OrcidName | null;
      // Outros campos como 'given-names', 'family-names' podem estar aqui
  }
  
  interface OrcidWorkContributorAttributes {
      'contributor-role': string; // e.g., AUTHOR, ASSIGNEE
  }
  interface OrcidWorkContributor {
      'contributor-orcid': {
          uri: string;
          path: string; // ORCID iD
          host: string;
      } | null;
      'credit-name': OrcidName | null; // Nome do contribuidor
      'contributor-email': any | null; // Geralmente nulo
      'contributor-attributes': OrcidWorkContributorAttributes | null;
  }
  
  
  interface OrcidWorkSummary {
    'put-code': number;
    'last-modified-date': { value: number };
    'created-date': { value: number };
    source: any; // Informação sobre a fonte do trabalho
    title: {
      title: OrcidName;
      subtitle: OrcidName | null;
      'translated-title': any | null; // Pode ser complexo
    } | null;
    'journal-title': OrcidName | null;
    'short-description': string | null;
    'citation': {
      'citation-type': string; // FORMATTED_UNSPECIFIED, BIBTEX, RIS etc.
      'citation-value': string;
    } | null;
    type: string; // JOURNAL_ARTICLE, BOOK_CHAPTER, CONFERENCE_PAPER, etc.
    'publication-date': OrcidPublicationDate | null;
    'external-ids': {
      'external-id': OrcidExternalId[];
    } | null;
    url: OrcidName | null;
    contributors?: { // Adicionado para incluir coautores nos summaries
        contributor: OrcidWorkContributor[];
    };
    visibility: string;
    path: string; // Caminho para o trabalho específico
    'display-index': string; // Usado para ordenação
  }
  
  interface OrcidWorksGroup {
    'last-modified-date': { value: number };
    'external-ids': { 'external-id': OrcidExternalId[] };
    'work-summary': OrcidWorkSummary[];
  }
  
  interface OrcidActivities {
    'last-modified-date': { value: number };
    // Seções como educations, employments, fundings, peer-reviews, works
    educations?: {
      'last-modified-date': { value: number };
      'affiliation-group': { // Pode ser affiliation-group ou education-summary dependendo da versão/config
          'summaries': Array<{ 'education-summary': OrcidAffiliation }>;
      }[] | Array<{ 'education-summary': OrcidAffiliation }>; // ORCID API pode ter estruturas aninhadas de formas diferentes
      path: string;
    };
    employments?: {
      'last-modified-date': { value: number };
      'affiliation-group': {
          'summaries': Array<{ 'employment-summary': OrcidAffiliation }>;
      }[] | Array<{ 'employment-summary': OrcidAffiliation }>;
      path: string;
    };
    works?: {
      'last-modified-date': { value: number };
      group: OrcidWorksGroup[];
      path: string; // Ex: /0000-0000-0000-0000/works
    };
    // Outras seções de atividades podem ser adicionadas aqui (fundings, peer-reviews, etc.)
  }
  
  interface OrcidPerson {
    'last-modified-date': { value: number };
    name: OrcidPersonName | null;
    'other-names': { // Array de outros nomes
      'last-modified-date': { value: number };
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
    biography: { // Biografia
      'last-modified-date': { value: number };
      content: string | null; // A biografia em si
      visibility: string;
      path: string;
    } | null;
    // Adicionar mais campos se necessário: researcher-urls, emails, addresses, keywords, external-identifiers
  }
  
  export interface OrcidFullRecord {
    'orcid-identifier': {
      uri: string;
      path: string; // O ORCID iD
      host: string;
    };
    preferences: any; // Detalhes sobre as preferências do usuário
    history: any; // Histórico de alterações (geralmente não muito útil para display)
    person: OrcidPerson;
    activities_summary: OrcidActivities | null; // Pode ser null se não houver atividades
    path: string; // O ORCID iD, repetido
    // Outros campos de alto nível podem existir
  }
  
  /**
   * Busca os dados completos do perfil de um pesquisador no ORCID.
   * @param orcidId O ORCID iD do pesquisador.
   * @returns Uma Promise com os dados completos do perfil.
   */
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
          Accept: "application/json", // Solicitamos a resposta em formato JSON
        },
      });
  
      if (!response.ok) {
        const errorBody = await response.text(); // Tenta ler o corpo do erro
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
      // Re-lança o erro para que o chamador possa tratá-lo, se necessário
      if (error instanceof Error) {
          throw new Error(`Falha na requisição para o ORCID: ${error.message}`);
      }
      throw new Error("Ocorreu um erro desconhecido ao buscar o perfil do ORCID.");
    }
  }
  

  