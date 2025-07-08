"""
Exemple d'utilisation Python
"""

import requests
import json

class MayaTranslatorClient:
    def __init__(self, api_base_url='http://localhost:3000/api'):
        self.api_base_url = api_base_url
        self.token = None

    def authenticate(self, username, password):
        response = requests.post(
            f'{self.api_base_url}/auth/login',
            json={'username': username, 'password': password}
        )
        
        data = response.json()
        if data.get('success'):
            self.token = data['token']
            return data
        raise Exception(data.get('error', 'Authentication failed'))

    def translate(self, text, from_lang, to_lang):
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f'{self.api_base_url}/translate',
            json={'text': text, 'fromLang': from_lang, 'toLang': to_lang},
            headers=headers
        )
        
        data = response.json();
        if data.get('success'):
            return data['translation']
        raise Exception(data.get('error', 'Translation failed'))

    def get_supported_languages(self):
        response = requests.get(f'{self.api_base_url}/languages')
        data = response.json()
        return data.get('languages', [])

# Utilisation
def example():
    client = MayaTranslatorClient()
    
    try:
        client.authenticate('demo', 'demo123')
        
        translation = client.translate(
            'Bonjour le monde',
            'french',
            'maya-yucateco'
        )
        
        print(f"Traduction: {translation['translatedText']}")
        
        languages = client.get_supported_languages()
        print(f"Langues supportées: {len(languages)}")
        
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == '__main__':
    example()