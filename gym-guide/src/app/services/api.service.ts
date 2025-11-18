import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map , catchError, tap } from 'rxjs';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Course, Coach, Tarif, Review, News, Message, SportEvent ,Athlete, FullProfile } from '../models';


@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiKey = 'cfbfbc837ade99f58d3faa1c188f0a54';
  private newsCache: News[] | null = null;
private baseUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'access_token';
  
  private apiUrl = 'https://football98.p.rapidapi.com/premierleague/table/squadname';

  private headers = new HttpHeaders({
    'x-rapidapi-host': 'football98.p.rapidapi.com',
    'x-rapidapi-key': 'ad9e7f236bmsh9ea317253eb61fep1aabb8jsn89098c6ff9b9'  });



  constructor(private http: HttpClient) {}
// Liste des cours visibles publiquement
  getPublicCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cours/`);
  }

  // Liste des coachs, sponsors, etc.


  // Actualités
  getActualites(): Observable<any> {
    return this.http.get(`${this.baseUrl}/actualites/`);
  }

  /* ==============================
      🔐 PARTIE AUTHENTIFICATION
     ============================== */

  // Connexion (JWT)
   login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/token/`, { email, password }).pipe(
    tap((res: any) => {
      // ✅ Si le backend renvoie bien les tokens
      if (res?.access) localStorage.setItem('access', res.access);
        if (res?.refresh) localStorage.setItem('refresh', res.refresh);
    }),
    // ⚠️ Gestion propre des erreurs HTTP (utile en debug)
    catchError((err) => {
      console.error('❌ Erreur lors du login:', err);
      throw err;
    })
  );
}




  // Déconnexion
  logout(): void {
      localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  // Récupérer le token
  getToken(): string | null {
        return localStorage.getItem('access');

  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Headers avec Bearer token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  /* ==============================
      🔒 PARTIE PRIVÉE (ADHERENT/COACH/ADMIN)
     ============================== */

  // Cours protégés (adhérent connecté)
  getPrivateCourses(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/cours/`, { headers });
  }

  // Profil de l'utilisateur connect
              getProfile(): Observable<FullProfile> {
        const token = localStorage.getItem('access');

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        });

  return this.http.get<FullProfile>(`${this.baseUrl}/user/profile/`, { headers });
}

updateFullProfile(data: FormData) {
  const token = localStorage.getItem('access');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });

  return this.http.put(`${this.baseUrl}/user/update-profile/`, data, { headers });
}

getStatus() {
  return this.http.get(`${this.baseUrl}/user/status`);
}

  // 🧍‍♂️ Liste des coachs
  private _coaches = signal<Coach[]>([
    { id: 1, nom: 'Haddad', prenom: 'Fares', email: 'fares.haddad90@fitclub.tn', telephone: '+216 25772529', specialite: 'Musculation', avatar: 'assets/coachs/coach3.jpg' },
    { id: 2, nom: 'Saidi', prenom: 'Chaker', email: 'chaker.saidi19@fitclub.tn', telephone: '+216 91369687', specialite: 'Musculation', avatar: 'https://i.pravatar.cc/120?img=2' },
    { id: 3, nom: 'Bensaid', prenom: 'Mohamed', email: 'mohamed.bensaid96@fitclub.tn', telephone: '+216 59062785', specialite: 'Musculation', avatar: 'https://i.pravatar.cc/120?img=3' },
    { id: 4, nom: 'Gharbi', prenom: 'Rami', email: 'rami.gharbi76@fitclub.tn', telephone: '+216 28639960', specialite: 'Musculation', avatar: 'https://i.pravatar.cc/120?img=4' },
    { id: 5, nom: 'Benali', prenom: 'Lotfi', email: 'lotfi.benali73@fitclub.tn', telephone: '+216 27913506', specialite: 'Musculation', avatar: 'https://i.pravatar.cc/120?img=5' },
    { id: 6, nom: 'Kefi', prenom: 'Souad', email: 'souad.kefi30@fitclub.tn', telephone: '+216 97867895', specialite: 'Gymnastique', avatar: 'https://i.pravatar.cc/120?img=6' },
    { id: 7, nom: 'Mansouri', prenom: 'Amina', email: 'amina.mansouri8@fitclub.tn', telephone: '+216 94707037', specialite: 'Gymnastique', avatar: 'https://i.pravatar.cc/120?img=7' },
    { id: 8, nom: 'Bensaid', prenom: 'Lina', email: 'lina.bensaid64@gymfit.tn', telephone: '+216 55221404', specialite: 'Yoga', avatar: 'https://i.pravatar.cc/120?img=8' },
    { id: 9, nom: 'Bensaid', prenom: 'Amina', email: 'amina.bensaid87@gymfit.tn', telephone: '+216 96996796', specialite: 'Yoga', avatar: 'https://i.pravatar.cc/120?img=9' },
    { id: 10, nom: 'Omrani', prenom: 'Chaker', email: 'chaker.omrani44@gymfit.tn', telephone: '+216 98654486', specialite: 'Cardio', avatar: 'https://i.pravatar.cc/120?img=10' },
    { id: 11, nom: 'Mansouri', prenom: 'Mohamed', email: 'mohamed.mansouri40@coachpro.tn', telephone: '+216 93662579', specialite: 'Boxe', avatar: 'https://i.pravatar.cc/120?img=11' },
    { id: 12, nom: 'Benali', prenom: 'Youssef', email: 'youssef.benali48@fitclub.tn', telephone: '+216 29903355', specialite: 'Boxe', avatar: 'https://i.pravatar.cc/120?img=12' },
    { id: 13, nom: 'Othmani', prenom: 'Salma', email: 'salma.othmani87@fitclub.tn', telephone: '+216 59869668', specialite: 'Yoga', avatar: 'https://i.pravatar.cc/120?img=13' },
    { id: 14, nom: 'Othmani', prenom: 'Hiba', email: 'hiba.othmani84@gymfit.tn', telephone: '+216 23103803', specialite: 'Pilates', avatar: 'https://i.pravatar.cc/120?img=14' },
    { id: 15, nom: 'Dridi', prenom: 'Souad', email: 'souad.dridi64@gymfit.tn', telephone: '+216 20253255', specialite: 'Yoga', avatar: 'https://i.pravatar.cc/120?img=15' },
    { id: 16, nom: 'Omrani', prenom: 'Khadija', email: 'khadija.omrani75@fitclub.tn', telephone: '+216 29601139', specialite: 'Musculation', avatar: 'https://i.pravatar.cc/120?img=16' },
    { id: 17, nom: 'Saidi', prenom: 'Nader', email: 'nader.saidi11@fitclub.tn', telephone: '+216 23524131', specialite: 'Yoga', avatar: 'https://i.pravatar.cc/120?img=17' },
    { id: 18, nom: 'Saidi', prenom: 'Zied', email: 'zied.saidi48@fitclub.tn', telephone: '+216 53301019', specialite: 'Cardio', avatar: 'https://i.pravatar.cc/120?img=18' },
    { id: 19, nom: 'Boukadida', prenom: 'Leila', email: 'leila.boukadida67@coachpro.tn', telephone: '+216 91168843', specialite: 'Cardio', avatar: 'https://i.pravatar.cc/120?img=19' },
    { id: 20, nom: 'Cherif', prenom: 'Rania', email: 'rania.cherif91@fitclub.tn', telephone: '+216 98269304', specialite: 'Musculation', avatar: 'https://i.pravatar.cc/120?img=20' }
  ]);

  // 🏋️‍♂️ Liste des cours
  private _courses = signal<Course[]>([
    { id: 1, title: 'HIIT Express', level: 'Intermédiaire', durationMin: 45, image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200', coachId: 10, tags: ['HIIT', 'Cardio'], description: 'Séance explosive pour brûler un max de calories.' },
    { id: 2, title: 'Power Lifting', level: 'Avancé', durationMin: 60, image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200', coachId: 1, tags: ['Force', 'Musculation'], description: 'Programme intensif pour prise de force et volume.' },
    { id: 3, title: 'Yoga Flow', level: 'Débutant', durationMin: 50, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200', coachId: 8, tags: ['Relaxation', 'Souplesse'], description: 'Cours doux et apaisant pour étirer le corps.' },
    { id: 4, title: 'Boxe Fit', level: 'Intermédiaire', durationMin: 55, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200', coachId: 12, tags: ['Boxe', 'Cardio'], description: 'Boxe et cardio pour tonifier tout le corps.' },
    { id: 5, title: 'Pilates Core', level: 'Débutant', durationMin: 40, image: 'https://images.unsplash.com/photo-1599050751790-5f2cdb3b3f35?q=80&w=1200', coachId: 14, tags: ['Pilates', 'Abdos'], description: 'Renforce les muscles profonds et améliore la posture.' }
  ]);

  // 💰 Tarifs
  private _tarifs = signal<Tarif[]>([
    { id: 1, title: 'Mensuel', price: 79, features: ['Accès illimité', 'Coachs inclus', 'App mobile'] },
    { id: 2, title: 'Trimestriel', price: 199, features: ['Accès illimité', 'Suivi personnalisé', 'Rapports'], best: true },
    { id: 3, title: 'Annuel', price: 699, features: ['Accès illimité', 'Plan nutrition', 'Coaching VIP'] }
  ]);

  // 💬 Avis utilisateurs
  private _reviews = signal<Review[]>([
    { id: 1, name: 'Amira T.', comment: 'Super salle, coachs motivants !', rating: 5 },
    { id: 2, name: 'Rami K.', comment: 'Cours variés et site facile à utiliser.', rating: 4 },
    { id: 3, name: 'Sarra L.', comment: 'Le suivi personnalisé m’a changé la vie !', rating: 5 },
    { id: 4, name: 'Karim B.', comment: 'Les séances HIIT sont incroyables, on sent les résultats rapidement.', rating: 5 },
    { id: 5, name: 'Leïla H.', comment: 'Application fluide et claire, très bons coachs !', rating: 4 },
    { id: 6, name: 'Youssef M.', comment: 'J’adore la variété des cours et la motivation du groupe.', rating: 5 },
    { id: 7, name: 'Nour F.', comment: 'Les conseils nutrition et bien-être sont vraiment utiles.', rating: 5 },
    { id: 8, name: 'Walid G.', comment: 'Interface moderne et simple, je recommande GYM-GUIDE.', rating: 4 },
    { id: 9, name: 'Aqmira L.', comment: 'GYM-GUIDE m’a aidée à retrouver la forme et la motivation !', rating: 5 },
    { id: 10, name: 'Tarek J.', comment: 'Des coachs attentifs et un site bien conçu, top !', rating: 5 }
  ]);

 getNews(): Observable<News[]> {
    const fallbackNews: News[] = [
      {
        id: 1,
        title: "L’Espérance remporte la Super Coupe 2025",
        source: "Mosaïque FM",
        image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1400&auto=format&fit=crop",
        url: "#",
        country: "Tunisie"
      },
      {
        id: 2,
        title: "Tunisie : marathon de Sousse 2025",
        source: "La Presse",
        image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1400&auto=format&fit=crop",
        url: "#",
        country: "Tunisie"
      },
      {
        id: 3,
        title: "JO 2028 : nouveautés dans les disciplines",
        source: "BBC Sport",
        image: "https://images.unsplash.com/photo-1505842465776-3ac45e07c6ca?q=80&w=1400&auto=format&fit=crop",
        url: "#",
        country: "Monde"
      },
      {
        id: 4,
        title: "Cristiano Ronaldo atteint 900 buts !",
        source: "Sky Sports",
        image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1400&auto=format&fit=crop",
        url: "#",
        country: "Monde"
      }
    ];

    // ✅ Évite de redemander l'API si on a déjà les données
    if (this.newsCache) {
      return of(this.newsCache);
    }

    const url = `https://api.mediastack.com/v1/news?access_key=${this.apiKey}&categories=sports&languages=fr,en&limit=8`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        if (!res?.data?.length) {
          console.warn('⚠️ Pas de données Mediastack, affichage local');
          this.newsCache = fallbackNews;
          return fallbackNews;
        }

        // 🧠 Transformer le JSON API → format local
        const articles = res.data.map((item: any, index: number) => ({
          id: index + 1,
          title: item.title || 'Actualité sportive',
          source: item.source || 'Source inconnue',
          image: item.image || fallbackNews[index % fallbackNews.length].image,
          url: item.url || '#',
          country: item.country || 'Monde'
        }));

        // 🧩 Stockage en cache (évite les quotas)
        this.newsCache = articles;
        return articles;
      }),
      catchError((err) => {
        console.error('❌ Erreur API Mediastack:', err);
        return of(fallbackNews);
      })
    );
  }
  

  /** ⚽ Événements sportifs dynamiques (via TheSportsDB) */
getEvents(sport: 'football' | 'basketball' | 'f1' | 'ufc' = 'football'): Observable<SportEvent[]> {
  let url = '';

  switch (sport) {
    case 'football':
      url = 'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328'; // Premier League
      break;
    case 'basketball':
      url = 'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4387'; // NBA
      break;
    case 'f1':
      url = 'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4370'; // F1
      break;
    case 'ufc':
      url = 'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4414'; // UFC
      break;
  }

  return this.http.get<any>(url).pipe(
    map(res =>
      (res.events || []).map((e: any) => ({
        idEvent: e.idEvent,
        strEvent: e.strEvent,
        strLeague: e.strLeague,
        strSport: e.strSport,
        dateEvent: e.dateEvent,
        strTime: e.strTime,
        strThumb: e.strThumb || 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 1000),
        strHomeTeam: e.strHomeTeam,
        strAwayTeam: e.strAwayTeam
      }))
    )
  );
}



  getCoaches(): Observable<Coach[]> {
    return of(this._coaches()).pipe(delay(200));
  }
  getPremierLeagueTeam(team: string): Observable<any> {
    const url = `${this.apiUrl}/${team}`; // Exemple : .../Liv ou .../Arsenal
    return this.http.get(url, { headers: this.headers });}


  // ✅ Autres fonctions (inchangées)
  getCourses(): Observable<Course[]> { return of(this._courses()).pipe(delay(200)); }
  getCourse(id: number) { return this.getCourses().pipe(map(l => l.find(c => c.id === id))); }
  getCoach(id: number) { return this._coaches().find(c => c.id === id); }
  getTarifs(): Observable<Tarif[]> { return of(this._tarifs()).pipe(delay(100)); }
  getReviews(): Observable<Review[]> { return of(this._reviews()).pipe(delay(100)); }



  sendMessage(m: Message) { return of({ ok: true }).pipe(delay(500)); }
  
  verifyOtp(c: string) { return of({ ok: true }).pipe(delay(400)); }

  // ✅ Inscription réelle (envoie les données à Django)
signup(data: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/register/`, data);
}



      }
    catchError((err) => {
      console.error('❌ Erreur inscription:', err);
      throw err;
    })
    
