import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {

  form!: FormGroup;
  loading = true;

  coursCoachList: any[] = [];

  // ⭐ Options modernes
  ratingOptions = [
    { value: 5, label: "Excellent", color: "#0080ff" },
    { value: 4, label: "Bien", color: "#00cc66" },
    { value: 3, label: "Moyen", color: "#ffcc00" },
    { value: 2, label: "Mauvais", color: "#ff4444" },
    { value: 1, label: "Très mauvais", color: "#555555" }
  ];

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  get coursReviewsArray(): FormArray {
    return this.form.get('cours_reviews') as FormArray;
  }

  ngOnInit() {
    this.form = this.fb.group({
      cours_reviews: this.fb.array([]),

      material: [null],
      equipment: [null],
      ambiance: [null],
      salle: [null],
      general_comment: ['']
    });

    this.loadCoursCoach();
  }

  // -------------------------------
  // ⭐ Sélection rating cours/coach
  // -------------------------------
  selectCoursReview(index: number, value: number) {
    this.coursReviewsArray.at(index).patchValue({ rating: value });
  }

  // -------------------------------
  // ⭐ Sélection rating général
  // -------------------------------
  selectGeneral(field: string, value: number) {
    this.form.patchValue({ [field]: value });
  }

  loadCoursCoach() {
    this.reviewService.getUserCoursCoach().subscribe({
      next: (data) => {
        this.coursCoachList = data;

        data.forEach((item: any) => {
          this.coursReviewsArray.push(
            this.fb.group({
              cours_id: [item.cours.id],
              coach_id: [item.coach.id],
              rating: [null, Validators.required],
              comment: ['']
            })
          );
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      alert("Veuillez noter tous les cours.");
      return;
    }

    this.reviewService.submitAllReviews(this.form.value).subscribe({
      next: () => alert("✔ Avis envoyés avec succès !"),
      error: () => alert("❌ Erreur lors de l’envoi des avis.")
    });
  }
}
