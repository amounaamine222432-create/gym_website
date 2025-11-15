import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface WeeklyPromo {
  id: number;
  title: string;
  discount: number;
  course: string;
  description: string;
  validUntil: string;
  image: string;
}

export interface WeeklyHighlight {
  coachOfWeek: {
    name: string;
    specialty: string;
    image: string;
    quote: string;
  };
  guestOfWeek: {
    name: string;
    activity: string;
    image: string;
    bio: string;
  };
  upcomingCourse: {
    title: string;
    startDate: string;
    image: string;
    description: string;
  };
}

@Injectable({ providedIn: 'root' })
export class NoveltyService {
  private promos: WeeklyPromo[] = [
    {
      id: 1,
      title: '🔥 -20% sur les cours de Yoga Flow',
      discount: 20,
      course: 'Yoga Flow',
      description: 'Détends ton esprit et ton corps cette semaine avec une réduction spéciale sur tous les cours de Yoga.',
      validUntil: this.nextSunday(),
      image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 2,
      title: '💪 -30% sur le Pack Musculation Premium',
      discount: 30,
      course: 'Musculation',
      description: 'Renforce-toi avec notre programme intensif, encadré par les meilleurs coachs du centre.',
      validUntil: this.nextSunday(),
      image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 3,
      title: '🏋️ -15% sur le Coaching Cardio HIIT',
      discount: 15,
      course: 'Cardio HIIT',
      description: 'Repousse tes limites et brûle un max de calories cette semaine ! Offre valable 7 jours.',
      validUntil: this.nextSunday(),
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  private highlights: WeeklyHighlight[] = [
    {
      coachOfWeek: {
        name: 'Amina Mansouri',
        specialty: 'Fitness & Cardio',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
        quote: 'Chaque goutte de sueur est une victoire personnelle.'
      },
      guestOfWeek: {
        name: 'Youssef Benali',
        activity: 'Champion national de CrossFit',
        image: 'https://i.postimg.cc/rmkHRydp/561621215-18404860339142341-8299278496614727191-n.jpg',
        bio: 'Youssef partagera ses secrets pour améliorer ta condition physique et repousser tes limites.'
        
      },
      upcomingCourse: {
        title: 'Cours de Boxe Fit 🥊',
        startDate: this.nextFriday(),
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
        description: 'Nouveau cours de Boxe Fit pour renforcer ton endurance et ta coordination. Disponible dès vendredi !'
      }
    },
    {
      coachOfWeek: {
        name: 'Rami Gharbi',
        specialty: 'Musculation & Force',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
        quote: 'La discipline bat le talent quand le talent ne travaille pas dur.'
      },
      guestOfWeek: {
        name: 'Lina Bensaid',
        activity: 'Championne de Yoga Flow',
        image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800&auto=format&fit=crop',
        bio: 'Lina animera une session spéciale de Yoga Relaxation samedi à 10h.'
      },
      upcomingCourse: {
        title: 'Nouveau cours de Zumba 💃',
        startDate: this.nextFriday(),
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
        description: 'Un mix explosif de danse et cardio pour s’amuser en brûlant des calories.'
      }
    }
  ];

  constructor() {}

  /** 🗓️ Retourne une promo de la semaine */
  getWeeklyPromo(): Observable<WeeklyPromo> {
    const weekIndex = this.getWeekIndex();
    return of(this.promos[weekIndex % this.promos.length]);
  }

  /** ⭐ Retourne le coach, l’invité et le cours de la semaine */
  getWeeklyHighlight(): Observable<WeeklyHighlight> {
    const weekIndex = this.getWeekIndex();
    return of(this.highlights[weekIndex % this.highlights.length]);
  }

  // 🔧 Utilitaires
  private getWeekIndex(): number {
    const now = new Date();
    const firstJan = new Date(now.getFullYear(), 0, 1);
    const diff = (now.getTime() - firstJan.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff / 7); // numéro de semaine
  }

  private nextSunday(): string {
    const date = new Date();
    const daysToAdd = 7 - date.getDay();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('fr-FR');
  }

  private nextFriday(): string {
    const date = new Date();
    const day = date.getDay();
    const daysToAdd = (5 + 7 - day) % 7;
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('fr-FR');
  }
}
