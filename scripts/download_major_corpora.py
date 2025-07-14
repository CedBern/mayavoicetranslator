"""
Script Python pour télécharger automatiquement des corpus open source majeurs (WASABI, TEDx, Million Song Dataset, HowTo100M, ActivityNet, MSR-VTT, YouCook2, etc.)
Place les fichiers dans data/AutresCorpus/ pour ingestion automatique par Maya Voice Translator.
Usage :
    python scripts/download_major_corpora.py
"""
import os
import urllib.request

CORPORA = [
    {
        'name': 'WASABI_Song_Corpus',
        'url': 'https://wasabi.i3s.unice.fr/datasets/WASABI_SongCorpus.json',
        'out': 'data/AutresCorpus/WASABI_SongCorpus.json'
    },
    {
        'name': 'TEDx_Multilingual',
        'url': 'https://opus.nlpl.eu/download.php?f=TED2020/v1/json/TED2020.json.gz',
        'out': 'data/AutresCorpus/TED2020.json.gz'
    },
    {
        'name': 'Million_Song_Dataset',
        'url': 'http://millionsongdataset.com/sites/default/files/AdditionalFiles/unique_tracks.txt',
        'out': 'data/AutresCorpus/MillionSong_unique_tracks.txt'
    },
    {
        'name': 'HowTo100M',
        'url': 'https://www.rocq.inria.fr/cluster-willow/amiech/howto100m/howto100m_features.zip',
        'out': 'data/AutresCorpus/HowTo100M_features.zip'
    },
    {
        'name': 'ActivityNet_Captions',
        'url': 'https://cs.stanford.edu/people/ranjaykrishna/densevid/captions.zip',
        'out': 'data/AutresCorpus/ActivityNet_captions.zip'
    },
    {
        'name': 'MSR-VTT',
        'url': 'https://www.robots.ox.ac.uk/~maxbain/frozen-in-time/data/MSR-VTT.zip',
        'out': 'data/AutresCorpus/MSR-VTT.zip'
    },
    {
        'name': 'YouCook2',
        'url': 'https://www.rocq.inria.fr/cluster-willow/amiech/howto100m/youcook2.zip',
        'out': 'data/AutresCorpus/YouCook2.zip'
    },
    # Ajoutez ici d'autres corpus publics si besoin
]

os.makedirs('data/AutresCorpus', exist_ok=True)

def download(url, out):
    print(f'Téléchargement {url} ...')
    try:
        urllib.request.urlretrieve(url, out)
        print(f'OK : {out}')
    except Exception as e:
        print(f'Erreur : {e}')

for corpus in CORPORA:
    download(corpus['url'], corpus['out'])

print('Téléchargements terminés. Placez d\'autres dumps dans data/AutresCorpus/ si besoin.')
