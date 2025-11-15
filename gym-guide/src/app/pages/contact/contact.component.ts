import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container py-5">
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <h2>Contact</h2>
        <p class="text-secondary">Une question ? Écris-nous, on répond vite.</p>

        <form #f="ngForm" (ngSubmit)="submit(f)" class="bg-white p-4 rounded-4 shadow-soft">
          <div class="mb-3"><label class="form-label">Nom</label><input class="form-control" name="name" ngModel required></div>
          <div class="mb-3"><label class="form-label">Email</label><input class="form-control" type="email" name="email" ngModel required></div>
          <div class="mb-3"><label class="form-label">Sujet</label><input class="form-control" name="subject" ngModel required></div>
          <div class="mb-3"><label class="form-label">Message</label><textarea class="form-control" rows="5" name="content" ngModel required></textarea></div>
          <button class="btn btn-brand rounded-pill px-4" [disabled]="sending">Envoyer</button>
          <span *ngIf="ok" class="text-success ms-3">Message envoyé ✔</span>
        </form>
      </div>

      <div class="col-12 col-lg-5 offset-lg-1">
        <div class="p-4 bg-white rounded-4 shadow-soft">
          <h6 class="mb-3">Infos</h6>
          <div class="d-flex align-items-start gap-3"><i class="bi bi-geo-alt"></i><div>42 Rue du Sport, 75000 Paris</div></div>
          <div class="d-flex align-items-start gap-3 mt-2"><i class="bi bi-envelope"></i><div>hello@gym-guide.com</div></div>
          <div class="ratio ratio-16x9 mt-3 rounded-4 overflow-hidden">
            <iframe src="https://maps.google.com/maps?q=paris&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ContactComponent {
  sending=false; ok=false;
  constructor(private api: ApiService){}
  submit(f: NgForm){
    if (f.invalid) return;
    this.sending = true; this.ok = false;
    this.api.sendMessage(f.value).subscribe(() => { this.ok = true; this.sending = false; f.resetForm(); });
  }
}
