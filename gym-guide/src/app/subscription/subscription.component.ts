// subscription.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  activeSubscription: any = null;
  loading = true;

  constructor(
    private router: Router,
    private subsService: SubscriptionService
  ) {}

  ngOnInit() {
    // 🔍 Vérifier si déjà abonné
    this.subsService.getMySubscription().subscribe({
      next: (res) => {
        if (res.active) {
          this.activeSubscription = res;
          console.log("🔵 Abonnement déjà actif :", res);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Erreur API :", err);
        this.loading = false;
      }
    });
  }

  // 🚀 Sélection abonnement
  selectPlan(plan: string) {

    // 🛑 Empêcher choix si abonné
    if (this.activeSubscription) {
      alert("Vous avez déjà un abonnement actif.");
      return;
    }

    // ✔ Sinon créer un nouvel abonnement
    this.subsService.createSubscription(plan).subscribe({
      next: (res: any) => {
        console.log('✅ Subscription créée :', res);

        localStorage.setItem('subscription_id', res.subscription_id);
        localStorage.setItem('pay_amount', res.price);

        this.router.navigate(['/payer'], { queryParams: { price: res.price } });
      },
      error: (err) => {
        console.error('❌ Subscription error:', err);
        alert(err.message || 'Erreur abonnement.');
      }
    });
  }
}
