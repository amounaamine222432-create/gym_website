import requests
import random
from django.conf import settings

YOUTUBE_API_KEY = settings.YOUTUBE_API_KEY


def generate_ai_videos(cours):
    """
    Génère 10 vidéos YouTube en rapport direct avec un cours
    en utilisant son nom, catégorie, niveau + un mot-clé aléatoire.
    """

    # 🔥 Mot clé aléatoire pour varier entre les cours
    random_key = random.choice([
        "workout", "training", "gym", "exercise",
        "hiit", "strength", "fitness", "power"
    ])

    # 🎯 Query intelligente basée sur :
    # - titre du cours
    # - catégorie
    # - niveau
    # - mot clé random
    query = f"{cours.titre} {cours.categorie} {cours.niveau} {random_key}".strip()

    print("🔍 Recherche YouTube :", query)

    # 🛰 Requête YouTube
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "key": YOUTUBE_API_KEY,
        "maxResults": 25,
        "type": "video",
        "videoEmbeddable": "true",
        "safeSearch": "moderate",
        "order": "relevance",
    }

    response = requests.get(url, params=params)
    data = response.json()

    print("📡 URL YouTube :", response.url)

    items = data.get("items", [])
    random.shuffle(items)  # 🔁 Mélange pour varier les vidéos

    videos = []

    for item in items[:10]:  # 🔟 Toujours max 10 vidéos
        snippet = item["snippet"]
        video_id = item["id"]["videoId"]

        videos.append({
            "titre": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "url": f"https://www.youtube.com/embed/{video_id}",
            "thumbnail": snippet["thumbnails"]["high"]["url"],
        })

    return videos
