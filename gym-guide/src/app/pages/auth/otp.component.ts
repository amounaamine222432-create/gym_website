import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-otp',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container py-5" style="max-width:560px;">
    <div class="bg-white p-4 rounded-4 shadow-soft">
      <h3 class="mb-3">Vérification OTP</h3>
      <p class="text-secondary">Entre le code reçu (ex: 123456)</p>
      <form #f="ngForm" (ngSubmit)="submit(f)">
        <div class="mb-3">
          <input class="form-control form-control-lg text-center fs-4" name="code" ngModel required pattern="\\d{6}" maxlength="6" placeholder="••••••">
        </div>
        <button class="btn btn-brand rounded-pill px-4" [disabled]="loading">Vérifier</button>
      </form>
      <div class="small mt-3"><a (click)="resend()" class="link-primary" role="button">Renvoyer le code</a></div>
    </div>
  </div>
  `
})
export class OtpComponent {
  loading=false;
  constructor(private api: ApiService, private router: Router){}
  submit(f: NgForm){
    if (f.invalid) return;
    this.loading = true;
    this.api.verifyOtp(f.value.code).subscribe(()=>{ this.loading=false; this.router.navigate(['/']); });
  }
  resend(){ alert('Code OTP renvoyé (simulation).'); }
}
