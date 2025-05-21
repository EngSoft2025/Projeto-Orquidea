import requests

def get_researcher_by_name(nome_pesquisador, token=None):
    """
    Busca IDs ORCID com base no nome de um pesquisador.
    
    Parâmetros:
    nome_pesquisador (str): Nome completo do pesquisador
    token (str, opcional): Token de acesso para a API (recomendado para mais resultados)
    
    Retorna:
    list: Lista de IDs ORCID encontrados
    """
    
    # Configurar cabeçalhos e parâmetros
    url = "https://pub.orcid.org/v3.0/search/"
    headers = {
        'Accept': 'application/json'
    }
    
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    params = {'q': nome_pesquisador}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            dados = response.json()
            ids = []
            
            # Extrair IDs dos resultados
            for resultado in dados.get('result', []):
                if 'orcid-identifier' in resultado:
                    orcid_id = resultado['orcid-identifier'].get('path')
                    if orcid_id:
                        ids.append(orcid_id)
            
            return ids
        else:
            print(f"Erro na requisição: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"Erro: {str(e)}")
        return []

# Exemplo de uso
ids = get_researcher_by_name("Seiji Isotani")
print("IDs ORCID encontrados:", ids)