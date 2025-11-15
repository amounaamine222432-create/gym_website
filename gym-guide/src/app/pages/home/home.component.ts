import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Tarif, Review, News, SportEvent , Athlete } from '../../models';
import { NoveltyService, WeeklyPromo, WeeklyHighlight } from '../../services/novelty.service';
import { FormsModule } from '@angular/forms';  // ✅ à importer ici

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  styleUrls: ['./home.component.scss'],
  template: `
  <!-- 🎯 HERO -->
  <section id="hero"
           class="hero text-center d-flex align-items-center justify-content-center py-5">
    <div class="container py-5">
      <h1 class="display-5 fw-bolder mb-3 animate__animated animate__fadeInDown">
        Progresse <span class="text-primary">vite</span> et <span class="text-success">bien</span>.
      </h1>
      <p class="lead text-secondary mb-4 animate__animated animate__fadeInUp">
        Des cours conçus par des coachs certifiés, des actualités sportives à jour
        et des tarifs attractifs.
      </p>
      <a routerLink="/signup" class="btn btn-brand rounded-pill px-4">Commencer maintenant</a>
    </div>
  </section>

  <!-- 💰 TARIFS -->
  <section id="tarifs" class="py-5 bg-white">
    <div class="container text-center">
      <h2 class="mb-5 fw-bold text-dark">Nos Tarifs</h2>
      <div class="row g-4 justify-content-center">
        <div class="col-12 col-md-6 col-lg-4"
             *ngFor="let t of tarifs"
             data-aos="fade-up">
          <div class="p-4 shadow-soft rounded-4 card-hover h-100 border"
               [class.border-primary]="t.best">
            <h5 class="fw-bold mb-3">{{ t.title }}</h5>
            <h2 class="text-primary mb-3">{{ t.price }} DT</h2>
            <ul class="list-unstyled mb-4">
              <li *ngFor="let f of t.features" class="text-secondary">
                <i class="bi bi-check2-circle text-success me-1"></i>{{ f }}
              </li>
            </ul>
            <a routerLink="/signup" class="btn btn-brand rounded-pill px-4">Choisir</a>
          </div>
        </div>
      </div>
    </div>
  </section>


<section id="nouveautes" class="py-5 text-center">
  <div class="container">
    <h2 class="fw-bold mb-4 text-dark">✨ Nouveautés de la Semaine</h2>
    <!-- Ton contenu ici -->
  </div>
</section>



    <!-- Promo -->
    <div *ngIf="promo" class="card mx-auto shadow-soft rounded-4 mb-5" style="max-width: 600px;">
      <img [src]="promo.image" class="card-img-top rounded-top-4" [alt]="promo.title">
      <div class="card-body">
        <h4 class="fw-bold text-primary">{{ promo.title }}</h4>
        <p class="small text-muted">Valable jusqu’au {{ promo.validUntil }}</p>
        <p>{{ promo.description }}</p>
      </div>
    </div>

    <!-- Coach & invité -->
    <div *ngIf="highlight" class="row g-4 justify-content-center">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm rounded-4">
          <img [src]="highlight.coachOfWeek.image" class="card-img-top rounded-top-4" alt="">
          <div class="card-body">
            <h5 class="fw-bold">Coach de la semaine</h5>
            <p>{{ highlight.coachOfWeek.name }}</p>
            <p class="small text-secondary fst-italic">« {{ highlight.coachOfWeek.quote }} »</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
  <div class="card h-100 shadow-sm rounded-4 overflow-hidden">
    <img [src]="highlight.guestOfWeek.image"
         class="card-img-top rounded-top-4"
         alt="{{ highlight.guestOfWeek.name}}">
    <div class="card-body text-center">
      <h5 class="fw-bold">Invité spécial</h5>
      <p class="fw-semibold mb-1">{{ highlight.guestOfWeek.name}}</p>
      <p class="small text-secondary mb-0">{{ highlight.guestOfWeek.bio}}</p>
    </div>
  </div>
</div>


      <div class="col-md-4">
        <div class="card h-100 shadow-sm rounded-4">
          <img [src]="highlight.upcomingCourse.image" class="card-img-top rounded-top-4" alt="">
          <div class="card-body">
            <h5 class="fw-bold">Nouveau cours à venir</h5>
            <p>{{ highlight.upcomingCourse.title }}</p>
            <p class="small text-secondary">{{ highlight.upcomingCourse.description }}</p>
            <p class="text-primary fw-bold">📅 Début : {{ highlight.upcomingCourse.startDate }}</p>
          </div>
        </div>
      </div>
    </div>

 <!-- 💬 AVIS -->
  <section id="avis" class="py-5 bg-light text-center">
    <div class="container">
      <h2 class="mb-5 fw-bold text-dark">Ils nous font confiance</h2>

      <div class="review-box mx-auto" *ngIf="currentReview">
        <blockquote class="blockquote mb-4 animate__animated animate__fadeIn">
          <p class="fs-5 fst-italic text-secondary">
            “{{ currentReview.comment }}”
          </p>
        </blockquote>

        <div class="fw-bold">{{ currentReview.name }}</div>
        <div class="text-warning fs-5 mt-2">
          {{ '★'.repeat(currentReview.rating) }}{{ '☆'.repeat(5 - currentReview.rating) }}
        </div>
      </div>

      <div class="mt-4 d-flex justify-content-center gap-2">
        <button *ngFor="let r of reviews; let i = index"
                class="dot"
                [class.active]="i === currentIndex"
                (click)="goToReview(i)">
        </button>
      </div>
    </div>
  </section>



<!-- 📰 ACTUALITÉS SPORTIVES DYNAMIQUES -->
<section id="news" class="py-5 bg-white">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">Actualités sportives</h2>

    <div class="row g-4 justify-content-center">
      <div class="col-md-6 col-lg-3" *ngFor="let n of news">
        <div class="card card-neo h-100 shadow-soft card-hover border-0 rounded-4 overflow-hidden">
          <img [src]="n.image" class="card-img-top" alt="{{ n.title }}">
          <div class="card-body">
            <span class="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill">{{ n.country }}</span>
            <h6 class="mt-3 fw-semibold">{{ n.title }}</h6>
            <small class="text-muted d-block mb-2">{{ n.source }}</small>
            <a [href]="n.url" target="_blank" class="small text-primary text-decoration-none">
              Lire plus <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 🏆 ÉVÉNEMENTS SPORTIFS -->
<section id="events" class="py-5 bg-light">
  <div class="container">
    <h2 class="text-center fw-bold mb-5">Événements sportifs à venir</h2>

    <!-- 🎠 Carrousel Bootstrap -->
    <div id="carouselEvents" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
      <div class="carousel-inner">

        <!-- Génération automatique de slides (3 événements par slide) -->
        <ng-container *ngFor="let group of chunkEvents(events, 3); let i = index">
          <div class="carousel-item" [class.active]="i === 0">
            <div class="row justify-content-center">
              <div class="col-md-4" *ngFor="let e of group">
                <div class="card card-neo shadow-soft h-100 border-0 rounded-4 overflow-hidden mx-2">
                  <img [src]="e.strThumb" class="card-img-top" alt="{{ e.strEvent }}"
                       onerror="this.src='https://picsum.photos/400/250?random=1'">
                  <div class="card-body text-center">
                    <h5 class="fw-bold mb-2">{{ e.strEvent }}</h5>
                    <p class="small text-muted mb-1">{{ e.strLeague }} — {{ e.strSport }}</p>
                    <p class="small text-muted mb-1">
                      🗓️ {{ e.dateEvent }} à {{ e.strTime || 'à confirmer' }}
                    </p>
                    <p class="fw-semibold mt-2">{{ e.strHomeTeam }} ⚡ {{ e.strAwayTeam }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

      </div>
            <!-- 🔘 team  news -->

           <div class="container mt-5 text-center">
      <input [(ngModel)]="team" class="form-control mb-3 w-50 mx-auto" placeholder="Nom de l'équipe (ex: Liv, Arsenal)">
      <button class="btn btn-primary mb-3" (click)="getTeam()">Rechercher</button>

      <div *ngIf="loading">Chargement...</div>
      <div *ngIf="error" class="text-danger">{{ error }}</div>

      <div *ngIf="data && data.length">
        <h4 class="mb-3">Résultats pour {{ team }}</h4>
        <div *ngFor="let item of data" class="border p-2 mb-2 rounded shadow-sm">
          <strong>{{ item.name }}</strong> — Points: {{ item.points }} | Classement: {{ item.rank }}
        </div>
      </div>

      <div *ngIf="!loading && data && data.length === 0">
        <p>Aucun résultat trouvé ⚽</p>
      </div>
    </div>
  

      <!-- 🔘 Contrôles -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselEvents" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Précédent</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselEvents" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Suivant</span>
      </button>
    </div>
  </div>
</section>
<!-- 🤝 PARTENAIRES / SPONSORS -->
<section id="sponsors" class="py-5 text-center bg-white">
  <div class="container">
    <h2 class="fw-bold mb-3 text-dark">Nos Partenaires & Sponsors</h2>
    <p class="text-secondary mb-5">
      Nous collaborons avec des marques qui soutiennent le sport, la performance et le bien-être.
    </p>
     <div class="d-flex flex-wrap justify-content-center align-items-center gap-5"
         data-aos="fade-up"
         data-aos-delay="200">

      <div class="sponsor-track">
        <img src="assets/jexer-platina-gym-seeklogo.png" alt="Jexer Platina Gym" class="sponsor-logo" />
        <img src="assets/sports-mind-seeklogo.png" alt="Sports Mind" class="sponsor-logo" />
        <img src="assets/master-card-seeklogo.png" alt="Mastercard" class="sponsor-logo" />
        <img src="assets/visa-seeklogo.png" alt="Visa" class="sponsor-logo" />
      </div>
    </div>
  </div>
</section>


  <!-- 📩 CONTACT -->
  <section id="contact" class="py-5 bg-light text-center">
    <div class="container">
      <h2 class="mb-4 fw-bold text-dark">Contact</h2>
      <p class="text-secondary mb-4">
        Une question ? Contacte notre équipe — nous te répondrons rapidement.
      </p>
      <a routerLink="/contact" class="btn btn-brand rounded-pill px-5">Nous contacter</a>
    </div>
  </section>
  `,
  styles: [`
    #hero {
      background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)),
                  url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop')
                  center/cover no-repeat;
      color: #fff;
      min-height: 100vh;
    }

    h2 { font-weight: 700; }
    .card img { height: 180px; object-fit: cover; }
    .card-hover { transition: transform .3s, box-shadow .3s; }
    .card-hover:hover {
      transform: translateY(-6px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    #avis { background-color: #f8f9fa; }
    .review-box {
      max-width: 520px;
      background: #fff;
      border-radius: 1rem;
      padding: 2rem 1.5rem;
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ccc;
      border: none;
      transition: background-color .3s;
    }
    .dot.active { background-color: var(--brand, #6C5CE7); }
    .dot:hover { background-color: var(--brand-2, #00D1B2); }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  tarifs: Tarif[] = [];
  reviews: Review[] = [];
  news: News[] = [];
  events: SportEvent[] = [];
  sports = ['Football', 'Musculation', 'Natation', 'Fitness', 'Cyclisme'];
  selectedSport = 'football';
  currentAthlete?: Athlete;
    promo?: WeeklyPromo;
  highlight?: WeeklyHighlight;

  currentReview?: Review;
  currentIndex = 0;
  intervalId: any;

    team = 'Arsenal';
  data: any[] = [];
  loading = false;
  error = '';


  constructor(private api: ApiService,private novelty: NoveltyService
) {}

  ngOnInit() {
       this.novelty.getWeeklyPromo().subscribe(p => this.promo = p);
    this.novelty.getWeeklyHighlight().subscribe(h => this.highlight = h);
    // 💰 Tarifs
    this.api.getTarifs().subscribe(t => this.tarifs = t);

    // 💬 Avis clients
    this.api.getReviews().subscribe(r => {
      this.reviews = r;
      this.currentReview = this.reviews[0];
      this.startAutoSlide();

    });
          this.getTeam();


    // 📰 Actualités sportives
    this.api.getNews().subscribe(n => this.news = n);

    // 🏆 Événements sportifs (par défaut : football)
    this.loadEvents();


  }

  /** Charger les événements (Football par défaut) */
  loadEvents() {
    this.api.getEvents('football').subscribe({
      next: (e) => (this.events = e),
      error: (err) => console.error('Erreur chargement événements :', err)
    });
  }

  /** 🔁 Carrousel avis */
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
      this.currentReview = this.reviews[this.currentIndex];
    }, 4000);
  }

  /** 🧩 Découpe les événements en groupes (3 par slide) */
  chunkEvents(array: any[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  

  

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  onImageError(event: any) {
  event.target.src =
    'https://images.unsplash.com/photo-1594737625785-c0f49adf6a8b?q=80&w=800&auto=format&fit=crop';
}
 goToReview(index: number) {         // ✅ AJOUT ICI
    this.currentIndex = index;
    this.currentReview = this.reviews[index];
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }  
    getTeam() {
    this.loading = true;
    this.error = '';
    this.api.getPremierLeagueTeam(this.team).subscribe({
      next: (res) => {
        this.loading = false;
        this.data = Array.isArray(res) ? res : [res];
        console.log('✅ Données reçues :', res);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erreur API : ' + err.message;
        console.error('❌ Erreur API', err);
      }
    });
  }
}


