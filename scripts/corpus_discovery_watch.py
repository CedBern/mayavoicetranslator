import requests
import feedparser
from datetime import datetime
import os

# Langues cibles (codes ISO ou noms)
TARGET_LANGS = [
    'nahuatl', 'wolof', 'bambara', 'quechua', 'aymara', 'fon', 'tzotzil', 'tzeltal', 'xhosa', 'zulu', 'yoruba', 'igbo', 'amharic', 'hausa', 'guarani', 'twi', 'kikongo', 'kimbundu', 'tamasheq', 'tigrinya', 'luo', 'shona', 'sango', 'lingala', 'sotho', 'tswana', 'tsonga', 'swati', 'venda', 'chichewa', 'kirundi', 'kikuyu', 'luganda', 'runyankore', 'acholi', 'fula', 'kanuri', 'berber', 'mapudungun', 'nahuat', 'nahuatl', 'maya', 'tzotzil', 'tzeltal', 'mixtec', 'zapotec', 'mazatec', 'otomi', 'huastec', 'tarahumara', 'huichol', 'purépecha', 'otomí', 'mazahua', 'totonac', 'chatino', 'chinantec', 'triqui', 'amuzgo', 'mixe', 'zoque', 'popoluca', 'chontal', 'chichimeca', 'seris', 'yaqui', 'cora', 'huave', 'tlapanec', 'cuicatec', 'tepehua', 'tepehuan', 'tarasco', 'tlaxcaltec', 'pame', 'otomanguean', 'zapotecan', 'mixtecan', 'chinantecan', 'popolocan', 'mazatecan', 'amuzgan', 'chontalan', 'huavean', 'totonacan', 'otomian', 'huichol', 'cora', 'tepehuan', 'tarahumaran', 'yaquian', 'serian', 'caddoan', 'uto-aztecan', 'mayance', 'tupi', 'guarani', 'mapuche', 'aymara', 'quechua', 'nahuatl', 'maya', 'tzotzil', 'tzeltal', 'mixtec', 'zapotec', 'mazatec', 'otomi', 'huastec', 'tarahumara', 'huichol', 'purépecha', 'otomí', 'mazahua', 'totonac', 'chatino', 'chinantec', 'triqui', 'amuzgo', 'mixe', 'zoque', 'popoluca', 'chontal', 'chichimeca', 'seris', 'yaqui', 'cora', 'huave', 'tlapanec', 'cuicatec', 'tepehua', 'tepehuan', 'tarasco', 'tlaxcaltec', 'pame', 'otomanguean', 'zapotecan', 'mixtecan', 'chinantecan', 'popolocan', 'mazatecan', 'amuzgan', 'chontalan', 'huavean', 'totonacan', 'otomian', 'huichol', 'cora', 'tepehuan', 'tarahumaran', 'yaquian', 'serian', 'caddoan', 'uto-aztecan', 'mayance', 'tupi', 'guarani', 'mapuche', 'aymara', 'quechua'
]

# Flux RSS à surveiller
RSS_FEEDS = [
    'https://zenodo.org/communities/linguistics/?page=1&size=20&sort=newest&subtype=dataset&type=dataset&format=rss',
    'https://www.elra.info/en/catalogue/rss/',
    'https://olac.ldc.upenn.edu/rss.xml',
]

# Dossier et fichier de rapport
REPORT_FILE = 'data/corpus_discovery_report.txt'
os.makedirs('data', exist_ok=True)

def search_github_corpora(lang):
    url = f'https://api.github.com/search/repositories?q=corpus+{lang}+language:data+in:description+in:readme+in:name&sort=updated&order=desc'
    headers = {'Accept': 'application/vnd.github.v3+json'}
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            items = resp.json().get('items', [])
            return [
                {
                    'name': item['name'],
                    'url': item['html_url'],
                    'desc': item['description']
                } for item in items[:3]
            ]
    except Exception as e:
        pass
    return []

def search_rss_corpora():
    results = []
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:10]:
                results.append({
                    'title': entry.title,
                    'link': entry.link,
                    'summary': entry.summary[:200] if hasattr(entry, 'summary') else ''
                })
        except Exception as e:
            pass
    return results

def main():
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write(f"Rapport de veille corpus - {datetime.now()}\n\n")
        f.write("--- GitHub ---\n")
        for lang in TARGET_LANGS:
            results = search_github_corpora(lang)
            if results:
                f.write(f"Langue : {lang}\n")
                for r in results:
                    f.write(f"- {r['name']} : {r['url']}\n  {r['desc']}\n")
        f.write("\n--- RSS ---\n")
        for r in search_rss_corpora():
            f.write(f"- {r['title']} : {r['link']}\n  {r['summary']}\n")
    print(f"Rapport généré : {REPORT_FILE}")

if __name__ == '__main__':
    main()
