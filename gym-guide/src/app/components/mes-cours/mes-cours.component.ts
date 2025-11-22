import { Component, OnInit } from '@angular/core';
import { CoursService } from '../../services/cours.service';
import { CommonModule } from '@angular/common';
import { ReviewFormComponent } from '../../reviews/review-form/review-form.component'; // 👈 AJOUT

@Component({
  standalone: true,
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css'],
  imports: [CommonModule, ReviewFormComponent ],
})
export class MesCoursComponent implements OnInit {

  tousCours: any[] = [];
  mesCours: any[] = [];

  selectedCoach: any;
selectedCours: any;

  coachs: any[] = [];
  seances: any[] = [];
  

  loading = false;

  constructor(private coursService: CoursService) {}

  ngOnInit(): void {
    this.loadCours();
  }

  loadCours() {
    this.loading = true;

    this.coursService.getAllCours().subscribe((all: any) => {
      this.tousCours = all;

      this.coursService.getMesCours().subscribe((mine: any) => {
        this.mesCours = mine;
        this.loading = false;
      });
    });
  }

  estInscrit(coursId: number): boolean {
    return this.mesCours.some(c => c.id === coursId);
  }

  participer(id: number) {
    this.coursService.joinCours(id).subscribe({
      next: () => this.loadCours(),
      error: () => alert('❌ Déjà inscrit')
    });
  }

  quitter(id: number) {
    this.coursService.quitCours(id).subscribe({
      next: () => this.loadCours(),
      error: () => alert('❌ Vous n’êtes pas inscrit à ce cours')
    });
  }

  // =========================
  //  🔥 MODAL : Coachs
  // =========================

  openCoachsModal(cours: any) {
    this.selectedCours = cours;
    this.selectedCoach = null;
    this.seances = [];

    this.coursService.getCoachs(cours.id).subscribe((data: any) => {
      this.coachs = data;

      // ouvrir modal
      const modal = document.getElementById('coachModal') as HTMLElement;
      modal.style.display = 'block';
    });
  }

  closeModal() {
    const modal = document.getElementById('coachModal') as HTMLElement;
    modal.style.display = 'none';
  }

 choisirCoach(coachId: number) {
  this.selectedCoach = coachId;

  // 1️⃣ On enregistre le choix du coach
  this.coursService.choisirCoach(this.selectedCours.id, coachId).subscribe({
    next: () => {
      // 2️⃣ Puis on charge ses séances
      this.loadSeances(coachId);
    },
    error: () => alert("❌ Ce coach est déjà assigné ce mois-ci")
  });
}

loadSeances(coachId: number) {
  this.coursService.getSeancesByCoach(this.selectedCours.id, coachId)
    .subscribe((data: any) => {
      this.seances = data;
    });
}
reserver(seanceId: number) {
  this.coursService.reserverSeance(seanceId).subscribe({
    next: () => {
      alert("✔ Réservation confirmée !");
      this.closeModal();
    },
    error: (err) => {
      if (err.error?.error) {
        alert("❌ " + err.error.error);  // message backend
      } else {
        alert("❌ Erreur lors de la réservation");
      }
    }
  });
}
}
