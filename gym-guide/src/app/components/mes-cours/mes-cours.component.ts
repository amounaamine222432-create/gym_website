import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from '../../shared/safe-url.pipe';

import { CoursService } from '../../services/cours.service';
import { VideoService } from '../../services/video.service';

@Component({
  standalone: true,
  selector: 'app-mes-cours',
  templateUrl: './mes-cours.component.html',
  styleUrls: ['./mes-cours.component.css'],
  imports: [CommonModule, RouterModule, SafeUrlPipe],
})
export class MesCoursComponent implements OnInit {

  // ==========================
  // Variables principales
  // ==========================
  tousCours: any[] = [];
  mesCours: any[] = [];

  selectedCours: any = null;
  selectedCoach: number | null = null;

  coachs: any[] = [];
  seances: any[] = [];

  loading = false;

  // ==========================
  // 🎥 Vidéos
  // ==========================
  videos: any[] = [];
  modalVisible = false;

  constructor(
    private coursService: CoursService,
  private videoService: VideoService

  ) {}

  // ==========================
  // INIT
  // ==========================
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

  // ==========================
  // Gestion participation
  // ==========================
  participer(id: number) {
    this.coursService.joinCours(id).subscribe({
      next: () => this.loadCours(),
      error: () => alert("❌ Déjà inscrit"),
    });
  }

  quitter(id: number) {
    this.coursService.quitCours(id).subscribe({
      next: () => this.loadCours(),
      error: () => alert("❌ Vous n’êtes pas inscrit à ce cours"),
    });
  }

  // ==========================
  // 👨‍🏫 Gestion Coach
  // ==========================
  openCoachsModal(cours: any) {
    this.selectedCours = cours;
    this.selectedCoach = null;
    this.seances = [];

    this.coursService.getCoachs(cours.id).subscribe((data: any) => {
      this.coachs = data;

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

    this.coursService.choisirCoach(this.selectedCours.id, coachId).subscribe({
      next: () => this.loadSeances(coachId),
      error: () => alert("❌ Ce coach est déjà assigné ce mois-ci"),
    });
  }

  loadSeances(coachId: number) {
    this.coursService.getSeancesByCoach(this.selectedCours.id, coachId)
      .subscribe((data: any) => this.seances = data);
  }
  

  reserver(seanceId: number) {
    this.coursService.reserverSeance(seanceId).subscribe({
      next: () => {
        alert("✔ Réservation confirmée !");
        this.closeModal();
      },
      error: (err) => {
        if (err.error?.error) {
          alert("❌ " + err.error.error);
        } else {
          alert("❌ Erreur lors de la réservation");
        }
      },
    });
  }

  // ==========================
  // 🎥 Vidéos
  // ==========================
  ouvrirVideos(coursId: number) {
  this.videoService.getVideos(coursId).subscribe({
    next: (data: any) => {
      this.videos = data;
      this.modalVisible = true;
    },
    error: () => {
      alert("❌ Impossible de charger les vidéos");
    }
  });
}

}
