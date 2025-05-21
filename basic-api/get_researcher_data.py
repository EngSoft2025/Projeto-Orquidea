import requests
import re
from datetime import datetime

def get_complete_researcher_data(orcid_id, token=None):
    """
    Obtém todos os dados disponíveis de um pesquisador via API ORCID com tratamento completo de erros
    
    Parâmetros:
    orcid_id (str): ORCID ID no formato 'xxxx-xxxx-xxxx-xxxx'
    token (str, opcional): Token de acesso para API member
    
    Retorna:
    dict: Dados estruturados ou mensagem de erro detalhada
    """
    
    # Validação do formato ORCID
    if not validate_orcid_format(orcid_id):
        return {'error': 'Formato ORCID inválido', 'received_id': orcid_id}
    
    # Configuração da requisição
    url = f"https://pub.orcid.org/v3.0/{orcid_id}"
    headers = {'Accept': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    try:
        # Fazendo a requisição com timeout
        response = requests.get(url, headers=headers, timeout=10)
        
        # Tratamento de status code
        if response.status_code != 200:
            return {
                'error': f'Erro na API ORCID (HTTP {response.status_code})',
                'details': response.text[:500] + '...' if response.text else 'Sem conteúdo',
                'orcid': orcid_id
            }
        
        data = response.json()
        
        # Estrutura principal de retorno
        result = {
            'personal': extract_personal_info(data, orcid_id),
            'employment': process_affiliations(safe_get(data, 'activities-summary', 'employments', 'employment-summary', default=[])),
            'education': process_affiliations(safe_get(data, 'activities-summary', 'educations', 'education-summary', default=[])),
            'works': process_works(safe_get(data, 'activities-summary', 'works', 'group', default=[])),
            'funding': process_fundings(safe_get(data, 'activities-summary', 'fundings', 'group', default=[])),
            # 'peer_reviews': process_peer_reviews(safe_get(data, 'activities-summary', 'peer-reviews', 'peer-review-group', default=[])),
            # 'services': process_services(safe_get(data, 'activities-summary', 'services', 'service-summary', default=[])),
            # 'memberships': process_memberships(safe_get(data, 'activities-summary', 'memberships', 'membership-summary', default=[])),
            'metrics': extract_metrics(data),
            'last_modified': safe_get(data, 'history', 'last-modified-date', 'value'),
            'raw_data': data if token else None  # Só inclui dados brutos se autenticado
        }
        
        return result
    
    except requests.exceptions.RequestException as e:
        return {'error': f'Erro de conexão: {str(e)}', 'orcid': orcid_id}
    except ValueError as e:
        return {'error': f'Resposta JSON inválida: {str(e)}', 'orcid': orcid_id}
    except Exception as e:
        return {'error': f'Erro inesperado: {str(e)}', 'orcid': orcid_id}

# Funções auxiliares =================================================================

def validate_orcid_format(orcid_id):
    """Valida o formato básico do ORCID ID"""
    return re.match(r'^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$', orcid_id) is not None

def safe_get(data, *keys, default=None):
    """Acesso seguro a dicionários aninhados"""
    current = data
    for key in keys:
        if isinstance(current, dict):
            current = current.get(key, {})
        elif isinstance(current, list) and isinstance(key, int) and key < len(current):
            current = current[key]
        else:
            return default
    return current if current not in [{}, [], None] else default

def extract_personal_info(data, orcid_id):
    """Extrai todas as informações pessoais"""
    return {
        'orcid': orcid_id,
        'name': {
            'given': safe_get(data, 'person', 'name', 'given-names', 'value'),
            'family': safe_get(data, 'person', 'name', 'family-name', 'value'),
            'credit': safe_get(data, 'person', 'name', 'credit-name', 'value'),
            'pronunciation': safe_get(data, 'person', 'name', 'name-phonetic', 'value')
        },
        'biography': safe_get(data, 'person', 'biography', 'content'),
        'countries': [safe_get(addr, 'country', 'value') for addr in safe_get(data, 'person', 'addresses', 'address', default=[])],
        'keywords': [safe_get(kw, 'content') for kw in safe_get(data, 'person', 'keywords', 'keyword', default=[])],
        'external_ids': process_external_ids(safe_get(data, 'person', 'external-identifiers', 'external-identifier', default=[])),
        'websites': [safe_get(site, 'url', 'value') for site in safe_get(data, 'person', 'researcher-urls', 'researcher-url', default=[])],
        'emails': [safe_get(email, 'email') for email in safe_get(data, 'person', 'emails', 'email', default=[])],
        'addresses': [
            {
                'country': safe_get(addr, 'country', 'value'),
                'city': safe_get(addr, 'city', 'value')
            } for addr in safe_get(data, 'person', 'addresses', 'address', default=[])
        ],
        'other_names': [safe_get(name, 'content') for name in safe_get(data, 'person', 'other-names', 'other-name', default=[])]
    }

def process_affiliations(affiliations):
    """Processa empregos e educação"""
    return [{
        'organization': safe_get(aff, 'organization', 'name'),
        'department': safe_get(aff, 'department-name'),
        'role': safe_get(aff, 'role-title'),
        'start_date': parse_date(safe_get(aff, 'start-date')),
        'end_date': parse_date(safe_get(aff, 'end-date')),
        'location': {
            'city': safe_get(aff, 'organization', 'address', 'city'),
            'country': safe_get(aff, 'organization', 'address', 'country')
        },
        'url': safe_get(aff, 'url', 'value')
    } for aff in affiliations if isinstance(aff, dict)]

def process_works(work_groups):
    """Processa trabalhos/publicações"""
    works = []
    for group in work_groups:
        work_summary = safe_get(group, 'work-summary', default=[])
        if work_summary and isinstance(work_summary, list):
            work = work_summary[0]
            works.append({
                'title': safe_get(work, 'title', 'title', 'value'),
                'type': safe_get(work, 'type'),
                'journal': safe_get(work, 'journal-title', 'value'),
                'citation': safe_get(work, 'citation', 'citation-value'),
                'publication_date': parse_date(safe_get(work, 'publication-date')),
                'url': safe_get(work, 'url', 'value'),
                'language': safe_get(work, 'language-code'),
                'external_ids': process_external_ids(safe_get(work, 'external-ids', 'external-id', default=[])),
                'contributors': [
                    {
                        'name': safe_get(c, 'credit-name', 'value'),
                        'role': safe_get(c, 'contributor-role'),
                        'orcid': safe_get(c, 'contributor-orcid', 'path')
                    } for c in safe_get(work, 'contributors', 'contributor', default=[])
                ]
            })
    return works

def process_fundings(funding_groups):
    """Processa informações de financiamento"""
    fundings = []
    for group in funding_groups:
        funding = safe_get(group, 'funding-summary', default=[])
        if funding and isinstance(funding, list):
            fund = funding[0]
            fundings.append({
                'title': safe_get(fund, 'title', 'title', 'value'),
                'type': safe_get(fund, 'type'),
                'amount': {
                    'value': safe_get(fund, 'amount', 'value'),
                    'currency': safe_get(fund, 'amount', 'currency-code')
                },
                'agency': safe_get(fund, 'organization', 'name'),
                'dates': {
                    'start': parse_date(safe_get(fund, 'start-date')),
                    'end': parse_date(safe_get(fund, 'end-date'))
                }
            })
    return fundings

def parse_date(date_dict):
    """Converte datas ORCID para formato ISO 8601"""
    if not date_dict:
        return None
    try:
        year = safe_get(date_dict, 'year', 'value', default='')
        month = safe_get(date_dict, 'month', 'value', default='01')
        day = safe_get(date_dict, 'day', 'value', default='01')
        return f"{year}-{month.zfill(2)}-{day.zfill(2)}" if year else None
    except:
        return None

def process_external_ids(ids):
    """Organiza identificadores externos"""
    return {safe_get(id, 'external-id-type'): safe_get(id, 'external-id-value')
            for id in ids if isinstance(id, dict)}

def extract_metrics(data):
    """Extrai métricas de pesquisa"""
    return {
        'works_count': safe_get(data, 'activities-summary', 'works', 'total', default=0),
        'citation_count': sum(
            safe_get(cite, 'citation-count', default=0)
            for cite in safe_get(data, 'activities-summary', 'works', 'citation', default={}).values()
        )
    }

# Exemplo de uso seguro
if __name__ == "__main__":
    orcid_id = "0000-0003-1574-0784"  #ORCID de exemplo
    result = get_complete_researcher_data(orcid_id)
    print(result)
    
    if 'error' in result:
        print(f"Erro: {result['error']}")
        if 'details' in result:
            print(f"Detalhes: {result['details']}")
    else:
        print("Dados recuperados com sucesso!")
        print(f"Nome: {result['personal']['name']['given']} {result['personal']['name']['family']}")
        print(f"Total de publicações: {result['metrics']['works_count']}")