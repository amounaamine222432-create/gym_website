import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-courses',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <section class="courses-section py-5">
    <div class="container">
      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-5">
        <h2 class="fw-bold mb-0">Tous les cours</h2>

        <div class="input-group input-group-lg shadow-sm" style="max-width: 420px;">
          <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
          <input class="form-control border-start-0" placeholder="Rechercher un cours, un tag..." [(ngModel)]="q" />
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-md-6 col-xl-4" *ngFor="let c of filtered()">
          <div class="card card-neo h-100 border-0 shadow-sm rounded-4 card-hover overflow-hidden">
            <div class="img-container">
              <img [src]="c.image" class="card-img-top" alt="{{c.title}}">
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge text-bg-primary-subtle text-primary">{{c.level}}</span>
                <span class="small text-muted"><i class="bi bi-clock"></i> {{c.durationMin}} min</span>
              </div>
              <h5 class="card-title fw-semibold">{{c.title}}</h5>
              <div class="mb-3">
                <span *ngFor="let t of c.tags" class="badge rounded-pill text-bg-light border me-1">{{t}}</span>
              </div>
              <a class="stretched-link text-decoration-none fw-medium" [routerLink]="['/courses', c.id]">Voir le cours</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .courses-section {
      margin-top: 6rem; /* ✅ espace sous la navbar */
      background-color: #f9fafb;
      min-height: 100vh;
    }
    .img-container {
      height: 220px;
      overflow: hidden;
    }
    .img-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .card-hover:hover .img-container img {
      transform: scale(1.08);
    }
    .card-hover {
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    }
  `]
})
export class CoursesComponent {
  q = '';
  courses = signal<Course[]>([]);
  filtered = computed(() => {
    const query = this.q.toLowerCase().trim();
    if (!query) return this.courses();
    return this.courses().filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.tags.some(t => t.toLowerCase().includes(query)) ||
      c.level.toLowerCase().includes(query)
    );
  });
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getCourses().subscribe(cs => this.courses.set(cs)); }

  
}

