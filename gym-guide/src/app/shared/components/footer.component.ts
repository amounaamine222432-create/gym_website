import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <footer class="footer text-light py-5 mt-5">
    <div class="container">
      <div class="row gy-4 justify-content-between">

        <!-- 🔹 Bloc description -->
        <div class="col-12 col-md-5">
          <h4 class="fw-bold mb-3">
            GYM<span class="text-warning">GUIDE</span>
          </h4>
          <p class="text-secondary small mb-3">
            GYM-GUIDE est une plateforme sportive complète conçue pour aider les coachs et les adhérents 
            à suivre leurs entraînements et leurs progrès. 
            Elle offre des plans personnalisés, un suivi intelligent et des actualités sportives pour rester motivé.
          </p>
          <a routerLink="/about" class="text-decoration-none text-light small fw-medium">
            Lire plus <i class="bi bi-arrow-right-short"></i>
          </a>
        </div>

        <!-- 🔹 Bloc company -->
        <div class="col-6 col-md-2">
          <h6 class="fw-bold text-white mb-3">Company</h6>
          <ul class="list-unstyled small">
            <li><a routerLink="/privacy" class="footer-link">Politique de confidentialité</a></li>
            <li><a routerLink="/refund" class="footer-link">Politique de remboursement</a></li>
          </ul>
        </div>

        <!-- 🔹 Bloc contact -->
        <div class="col-6 col-md-3">
          <h6 class="fw-bold text-white mb-3">Contact</h6>
          <ul class="list-unstyled small mb-2 text-secondary">
            <li><i class="bi bi-telephone me-2"></i> +216 98 765 432</li>
            <li><i class="bi bi-telephone me-2"></i> +216 55 223 998</li>
          </ul>
          <a href="mailto:contact@gym-guide.com" class="footer-link">
            <i class="bi bi-envelope me-2"></i>contact@gym-guide.com
          </a>
        </div>

        <!-- 🔹 Bloc Terms -->
        <div class="col-12 col-md-2">
          <h6 class="fw-bold text-white mb-3">Terms</h6>
          <ul class="list-unstyled small">
            <li><a routerLink="/terms" class="footer-link">Conditions d’utilisation</a></li>
          </ul>
        </div>
      </div>

      <hr class="border-secondary my-4 opacity-25">

      <div class="text-center small text-secondary">
        © {{year}} GYM-GUIDE — Tous droits réservés.
      </div>
    </div>
  </footer>
  `,
  styles: [`
    .footer {
      background-color: #0b0b0b;
      color: #ccc;
      font-family: 'Poppins', sans-serif;
    }
    .footer h4, .footer h6 {
      color: #fff;
    }
    .footer-link {
      color: #9d9d9d;
      text-decoration: none;
      transition: color .2s ease-in-out;
    }
    .footer-link:hover {
      color: var(--brand-2, #00D1B2);
    }
    .footer .text-warning {
      color: #f9c72f !important;
    }
    .footer hr {
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    @media (max-width: 768px) {
      .footer {
        text-align: center;
      }
      .footer .col-md-2, .footer .col-md-3, .footer .col-md-5 {
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}

