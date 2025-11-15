import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Course, Coach } from '../../models';

@Component({
  standalone: true,
  selector: 'app-course-detail',
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container py-5" *ngIf="course">
    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <img [src]="course.image" class="rounded-4 w-100 shadow-soft" alt="{{course.title}}">
      </div>

      <div class="col-12 col-lg-5">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="badge text-bg-primary-subtle text-primary">{{course.level}}</span>
          <span class="small text-muted"><i class="bi bi-clock"></i> {{course.durationMin}} min</span>
        </div>

        <h2 class="mb-3">{{course.title}}</h2>
        <p class="text-secondary">{{course.description}}</p>

        <div class="d-flex align-items-center gap-3 my-3" *ngIf="coach">
          <img [src]="coach.avatar" class="rounded-circle" width="64" height="64" alt="coach">
          <div>
            <div class="fw-medium">{{coach.prenom}} {{coach.nom}}</div>
            <small class="text-muted">{{coach.specialite}}</small><br>
            <small class="text-muted"><i class="bi bi-envelope"></i> {{coach.email}}</small><br>
            <small class="text-muted"><i class="bi bi-telephone"></i> {{coach.telephone}}</small>
          </div>
        </div>

        <div class="mt-4 d-flex gap-3">
          <a routerLink="/signup" class="btn btn-brand rounded-pill px-4">S’inscrire pour réserver</a>
          <a routerLink="/courses" class="btn btn-outline-secondary rounded-pill px-4">Retour</a>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    img { object-fit: cover; }
    .badge { font-size: 0.9rem; }
  `]
})
export class CourseDetailComponent {
  course?: Course;
  coach?: Coach;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCourses().subscribe(courses => {
      this.course = courses.find(c => c.id === id);
      if (this.course) {
        this.coach = this.api.getCoach(this.course.coachId);
      }
    });
  }
}

