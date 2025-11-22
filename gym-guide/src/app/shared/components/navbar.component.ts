import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
  <nav class="navbar navbar-expand-lg navbar-glass fixed-top py-3" [class.scrolled]="scrolled">
  <div class="container">

    <!-- BRAND -->
    <a class="navbar-brand fw-bold d-flex align-items-center gap-1" routerLink="/">
      <i class="bi bi-activity text-primary"></i>
      <span>GYM</span><span class="text-primary">GUIDE</span>
    </a>

    <!-- BURGER MENU -->
    <button class="navbar-toggler border-0 shadow-none" type="button"
            data-bs-toggle="collapse" data-bs-target="#navGG">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- NAVBAR CONTENT -->
    <div class="collapse navbar-collapse" id="navGG">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3 text-center">

        <!-- 🌍 NAV PUBLIC (VISITEUR NON CONNECTÉ) -->
        <ng-container *ngIf="!isLogged">

          <li class="nav-item"><a class="nav-link" (click)="scrollTo('hero')">Accueil</a></li>
          <li class="nav-item"><a class="nav-link" (click)="scrollTo('tarifs')">Tarifs</a></li>
          <li class="nav-item"><a class="nav-link" (click)="scrollTo('avis')">Avis</a></li>
          <li class="nav-item"><a class="nav-link" (click)="scrollTo('news')">Actualités</a></li>

          <!-- 🟩 COURS PUBLIC -->
          <li class="nav-item">
            <a class="nav-link" routerLink="/courses">Cours</a>
          </li>

          <!-- 🟩 COACHS PUBLIC -->
          <li class="nav-item">
            <a class="nav-link" routerLink="/coaches">Coachs</a>
          </li>

          <!-- 🔵 CONNEXION -->
          <li class="nav-item mt-2 mt-lg-0">
            <a class="btn btn-sm btn-brand rounded-pill px-3 ms-lg-2" routerLink="/login">
              Connexion
            </a>
          </li>

        </ng-container>

        <!-- 🔐 NAV PRIVÉE (UTILISATEUR CONNECTÉ) -->
        <ng-container *ngIf="isLogged">

          <!-- Cours (Toujours visible en privé) -->
          <li class="nav-item dropdown d-none d-lg-block">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              Cours
            </a>

            <ul class="dropdown-menu">
              <li><a class="dropdown-item" routerLink="/mes-cours">Mes cours</a></li>
            </ul>
          </li>

          <a routerLink="/subscription" routerLinkActive="active-link" class="nav-link">
              Abonnement
          </a>
          <li class="nav-item">
  <a routerLink="/avis" routerLinkActive="active"
     class="nav-link fw-bold">
    📝 Avis
  </a>
</li>

          <!-- Coachs visible -->
          <li class="nav-item d-none d-lg-block">
            <a class="nav-link" routerLink="/coaches">Coachs</a>
          </li>
          <li class="nav-item d-none d-lg-block" *ngIf="showProfileButton">
               <a class="nav-link" routerLink="/profil">Mon Profil</a>
              </li>
              

          <!-- 🌗 Dark Mode -->
          <li class="nav-item">
            <app-theme-toggle></app-theme-toggle>
          </li>

          <!-- 👤 MENU UTILISATEUR -->
          <li class="nav-item dropdown mt-2 mt-lg-0">
            <a class="btn btn-sm btn-outline-primary rounded-pill px-3 ms-lg-2 dropdown-toggle"
               data-bs-toggle="dropdown">
              Mon Compte
            </a>

            <ul class="dropdown-menu dropdown-menu-end">

              <!-- Dashboard -->
              <li>
                <a class="dropdown-item" routerLink="/dashboard">
                  📊 Tableau de bord
                </a>
              </li>

              <!-- Profil COMPLET -->


             <!-- Compléter Profil (profil INCOMPLET) -->
              <li *ngIf="!showProfileButton">
                        <a class="dropdown-item text-warning" routerLink="/profil">
                            ⚠️ Compléter mon profil
                          </a>
                </li>

<li><hr class="dropdown-divider"></li>
  
              <li><hr class="dropdown-divider"></li>

              <!-- Déconnexion -->
              <li>
                <a class="dropdown-item text-danger" (click)="logout()">
                  🚪 Déconnexion
                </a>
              </li>

            </ul>
          </li>

        </ng-container>

      </ul>
    </div>

  </div>
</nav>



  `,
  styles: [`
    .navbar { transition: background-color .3s, box-shadow .3s; }
    .navbar.scrolled {
      background: rgba(255,255,255,0.9);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .dark .navbar.scrolled {
      background: rgba(0,0,0,0.7);
      box-shadow: 0 4px 12px rgba(255,255,255,0.1);
    }
    .nav-link {
      font-weight: 500;
      transition: color .2s;
      cursor: pointer;
      position: relative;
    }
    .nav-link:hover, .nav-link.active { color: var(--brand); }

    /* ✨ Badge animé “nouveauté” */
    .pulse-badge {
      animation: pulse 1.5s infinite;
    }
    .active-link {
  font-weight: bold;
  color: #0d6efd !important;
}

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.8); opacity: 0.4; }
      100% { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 991px) {
      .navbar-nav { gap: 1rem; }
      .navbar-glass { background: rgba(255,255,255,.95); }
      .dark .navbar-glass { background: rgba(0,0,0,.85); }
    }
  `]
})
export class NavbarComponent {
  scrolled = false;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

 scrollTo(id: string) {
  // Si tu es sur la page d’accueil
  if (this.router.url === '/') {
    this.scrollSmooth(id);
  } else {
    // Si tu viens d’une autre page, on y va puis on scrolle après un petit délai
    this.router.navigate(['/']).then(() => {
      setTimeout(() => this.scrollSmooth(id), 500);
    });
  }

  this.closeMenuOnMobile();
}

private scrollSmooth(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.warn('⚠️ Section introuvable :', id);
  }
}

  private closeMenuOnMobile() {
    const navCollapse = document.getElementById('navGG');
    if (navCollapse && navCollapse.classList.contains('show')) {
      (window as any).bootstrap?.Collapse.getOrCreateInstance(navCollapse)?.hide();
    }
  }

    get isLogged(): boolean {
  return !!localStorage.getItem('access');
}

  get showProfileButton(): boolean {
    const status = localStorage.getItem('user_status');
    if (!status) return false;

    return JSON.parse(status).is_profile_completed === true;
  }

  

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem("user_status");

    this.router.navigate(['/login']);
  }
  get user() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}




}
