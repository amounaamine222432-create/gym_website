export interface Coach {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  avatar: string;
}

export interface Course {
  id: number;
  title: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  durationMin: number;
  image: string;
  coachId: number;
  tags: string[];
  description: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
}
export interface News {
  id:number;
  title: string;
  source: string;
  country: string;
  image: string;
  url: string;
}
export interface SportEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strSport: string;
  dateEvent: string;
  strTime: string;
  strThumb: string;
  strHomeTeam: string;
  strAwayTeam: string;
}
export interface Athlete {
  name: string;
  sport: string;
  team?: string;
  country?: string;
  birth?: string;
  description?: string;
  image?: string;
}
export interface FullProfile {
  id: number;
  email: string;
  username: string;

  first_name: string;
  last_name: string;
  sex: string;
  age: number;
  photo: string | null;

  date_naissance?: string;
  telephone?: string;
  poids?: number;
  taille?: number;
  objectif?: string;
  niveau?: string;
  frequence_entrainement?: number;

  date_joined: string;
}


export interface Tarif{ id:number; title:string; price:number; features:string[]; best?:boolean; }
export interface Review{ id:number; name:string; comment:string; rating:number; }
export interface Message{ name:string; email:string; subject:string; content:string; }

