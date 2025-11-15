import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-coaches',
  imports: [CommonModule],
  template: `
 <section class="coaches-section py-5 bg-light" data-aos="fade-up">
    <div class="container">
      <h2 class="text-center mb-5 fw-bold">Nos Coachs Professionnels</h2>

      <div class="row g-4">
        <div class="col-12 col-md-6 col-lg-4" *ngFor="let coach of coaches">
          <div class="card border-0 shadow-sm rounded-4 h-100 card-hover p-4 text-center bg-white">
            <img [src]="coach.avatar" alt="photo" class="rounded-circle mx-auto mb-3" width="90" height="90">
            <h5 class="fw-bold mb-1">{{ coach.prenom }} {{ coach.nom }}</h5>
            <p class="text-primary fw-medium mb-1">{{ coach.specialite }}</p>
            <div class="small text-muted">
              <i class="bi bi-envelope me-1"></i>{{ coach.email }}<br>
              <i class="bi bi-telephone me-1"></i>{{ coach.telephone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  
  styles: [`
    .coaches-section {
      margin-top: 6rem; /* ✅ espace sous la navbar */
      min-height: 100vh;
    }
    .card-hover {
      transition: all 0.3s ease-in-out;
    }
    .card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    .card {
      background: #fff;
      border-radius: 1rem;
    }
    h2 {
      font-weight: 700;
      color: #111;
    }
  `]
})
export class CoachesComponent {
  coaches: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCoaches().subscribe(cs => this.coaches = cs);
  }
}
