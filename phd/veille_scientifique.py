# Script de veille scientifique automatisée (exemple Python)

import feedparser
import time

KEYWORDS = ["mayan language", "language revitalization", "linguistic corpus", "AI linguistics"]
SOURCES = [
    "https://scholar.google.com/alerts/feeds/1234567890",
    "https://hal.science/rss",
    "https://arxiv.org/rss/cs.CL"
]

for source in SOURCES:
    feed = feedparser.parse(source)
    for entry in feed.entries:
        if any(keyword.lower() in entry.title.lower() for keyword in KEYWORDS):
            print(f"{entry.title} - {entry.link}")
    time.sleep(1)
