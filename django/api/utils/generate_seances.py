import datetime
import random
from django.utils import timezone
from api.models import Coach, Seance, CoachCours

# Génère 3 horaires aléatoires entre 10h et 23h (1 heure chacun)
def generate_random_slots():
    hours = list(range(10, 23))  # 10..22
    random_hours = random.sample(hours, 3)  # choisir 3 heures différentes
    random_hours.sort()

    slots = []
    for h in random_hours:
        hd = datetime.time(h, 0)
        hf = datetime.time(h + 1, 0)
        slots.append((hd, hf))
    return slots


def generate_seances(days=30):

    today = timezone.now().date()

    for coach in Coach.objects.all():

        cycle_start = coach.start_shift_day      # 1..7
        cycle_length = 7                         # 5 travail / 2 repos

        coach_courses = CoachCours.objects.filter(coach=coach)

        for d in range(days):
            date = today + datetime.timedelta(days=d)

            # Calcule le jour dans le cycle
            cycle_day = ((d + cycle_start) % cycle_length) + 1

            # 🔥 Jours 1 à 5 = TRAVAIL
            if cycle_day <= 5:

                # 3 séances aléatoires ENTRE 10h ET 23h
                seance_slots = generate_random_slots()

                for relation in coach_courses:
                    cours = relation.cours

                    for idx, (hd, hf) in enumerate(seance_slots):

                        exists = Seance.objects.filter(
                            cours=cours,
                            coach=coach,
                            date_seance=date,
                            heure_debut=hd,
                            heure_fin=hf
                        ).exists()

                        if not exists:
                            Seance.objects.create(
                                cours=cours,
                                coach=coach,
                                date_seance=date,
                                heure_debut=hd,
                                heure_fin=hf,
                                salle=f"Salle {idx+1}",
                                statut="planifie",
                            )
