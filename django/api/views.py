from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Adherent,Cours,CoursParticipation,Coach,Seance,CoachCours,Subscription,ClientCoachSelection
from datetime import datetime
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


import stripe
from django.http import HttpResponse

# ---condition complete---------------------------------------------------
def check_profile_completed(profile: Profile, adherent: Adherent) -> bool:

    def is_filled(value):
        return value not in [None, "", "null", "None"]

    required_profile_fields = [
        profile.first_name,
        profile.last_name,
        profile.age,
        profile.sex,
        profile.photo,
    ]

    required_adherent_fields = [
        adherent.telephone,
        adherent.objectif,
        adherent.niveau,
        adherent.poids,
        adherent.date_naissance,
        adherent.taille,
        adherent.frequence_entrainement,
    ]

    all_fields = required_profile_fields + required_adherent_fields

    return all(is_filled(f) for f in all_fields)



# ---REGISTER------------------------------------------------------
@csrf_exempt
@api_view(['POST'])
def register(request):

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    age = request.data.get('age')
    sex = request.data.get('sex')
    photo = request.FILES.get('photo')

    # Champs obligatoires
    if not all([username, email, password, first_name, last_name, age, sex]):
        return Response({"error": "Tous les champs obligatoires sont requis."}, status=400)

    # Email unique
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email déjà utilisé"}, status=400)

    # Username unique automatique
    base_username = username
    i = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{i}"
        i += 1

    # Création User
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    # Création du Profil (uniquement ici !)
    Profile.objects.create(
        user=user,
        first_name=first_name,
        last_name=last_name,
        age=int(age),
        sex=sex,
        photo=photo
    )

    # Créer Adherent si pas existant
    Adherent.objects.get_or_create(user=user)

    return Response({"message": "Compte créé avec succès"}, status=201)

# 2️⃣ LOGIN EMAIL / PASSWORD
# ---------------------------------------------------------
# 2️⃣ LOGIN EMAIL / PASSWORD
# ---------------------------------------------------------
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError({"detail": "Email et mot de passe requis."})

        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({"detail": "Email introuvable."})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Mot de passe incorrect."})

        refresh = self.get_token(user)
        profile = Profile.objects.get(user=user)

        # --- Construction réponse complète ---
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "photo": (
                self.context["request"].build_absolute_uri(profile.photo.url)
                if profile.photo else None
            ),
            "is_profile_completed": profile.is_profile_completed,
        }

        return data



class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer



# ---------------------------------------------------------
# 3️⃣ GET PROFIL COMPLET
# ---------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def full_profile(request):
    user = request.user

    profile, _ = Profile.objects.get_or_create(
        user=user,
        defaults={"first_name": "", "last_name": "", "age": 0, "sex": "Homme"}
    )

    adherent, _ = Adherent.objects.get_or_create(user=user)

    data = {
        "id": user.id,
        "email": user.email,
        "username": user.username,

        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "sex": profile.sex,
        "age": profile.age,

        # ✅ ON MET UNE SEULE VERSION DE LA PHOTO
        "photo": request.build_absolute_uri(profile.photo.url) if profile.photo else None,

        "date_naissance": adherent.date_naissance,
        "telephone": adherent.telephone,
        "poids": adherent.poids,
        "taille": adherent.taille,
        "objectif": adherent.objectif,
        "niveau": adherent.niveau,
        "frequence_entrainement": adherent.frequence_entrainement,

        "is_profile_completed": profile.is_profile_completed,
    }

    return Response(data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_status(request):
    user = request.user

    profile, _ = Profile.objects.get_or_create(user=user)
    adherent, _ = Adherent.objects.get_or_create(user=user)

    is_profile_ok = profile.is_completed()
    is_adherent_ok = adherent.is_completed()

    return Response({
        "is_profile_completed": profile.is_profile_completed,
        "profile_completed": is_profile_ok,
        "adherent_completed": is_adherent_ok
    })



# ---------------------------------------------------------
# 4️⃣ UPDATE PROFIL
# ---------------------------------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_full_profile(request):
    print("🔵 DATA REÇUE :", request.data)
    print("🟣 FILES :", request.FILES)
    user = request.user
    profile = Profile.objects.get(user=user)
    adherent, _ = Adherent.objects.get_or_create(user=user)

    # -------------------------
    # USER
    # -------------------------
    if "email" in request.data:
        user.email = request.data["email"].strip()

    if "username" in request.data:
        user.username = request.data["username"].strip()

    user.save()

    # -------------------------
    # PROFILE
    # -------------------------
    profile.first_name = request.data.get("first_name", "").strip()
    profile.last_name = request.data.get("last_name", "").strip()

    age_val = request.data.get("age")
    if age_val not in [None, ""]:
        try:
            profile.age = int(age_val)
        except:
            pass

    if "sex" in request.data:
        profile.sex = request.data["sex"]

    if "photo" in request.FILES:
        profile.photo = request.FILES["photo"]

    profile.save()

    # -------------------------
    # ADHERENT
    # -------------------------

    # Date de naissance
    date_val = request.data.get("date_naissance")
    if date_val not in [None, "", "null", "None"]:
        try:
            adherent.date_naissance = datetime.strptime(date_val, "%Y-%m-%d").date()
        except:
            pass

    adherent.telephone = request.data.get("telephone", "")
    adherent.objectif = request.data.get("objectif", "")
    adherent.niveau = request.data.get("niveau", "")

    # Conversion sûre
    def safe_float(v):
        try:
            return float(v)
        except:
            return None

    def safe_int(v):
        try:
            return int(v)
        except:
            return None

    p = safe_float(request.data.get("poids"))
    if p is not None:
        adherent.poids = p

    t = safe_float(request.data.get("taille"))
    if t is not None:
        adherent.taille = t

    f = safe_int(request.data.get("frequence_entrainement"))
    if f is not None:
        adherent.frequence_entrainement = f

    adherent.save()

    # -------------------------
    # COMPLETE OR NOT ?
    # -------------------------
    is_complete = check_profile_completed(profile, adherent)
    profile.is_profile_completed = is_complete
    profile.save()

    return Response({
        "message": "Profil mis à jour",
        "photo_url": request.build_absolute_uri(profile.photo.url) if profile.photo else None,
        "is_profile_completed": is_complete
    }, status=200)

@api_view(['GET'])
def get_cours(request):
    cours = Cours.objects.all()
    data = [{
        "id": c.id,
        "titre": c.titre,
        "description": c.description,
        "categorie": c.categorie,
        "capacite": c.capacite,
        "niveau": c.niveau,
        "objectif_cible": c.objectif_cible,
        "photo": c.photo,
    } for c in cours]

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rejoindre_cours(request):
    user = request.user
    cours_id = request.data.get("cours_id")

    if not Cours.objects.filter(id=cours_id).exists():
        return Response({"error": "Cours introuvable"}, status=404)

    participation, created = CoursParticipation.objects.get_or_create(
        user=user,
        cours_id=cours_id
    )

    if not created:
        return Response({"error": "Déjà inscrit"}, status=400)

    return Response({"message": "Inscription réussie"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def quitter_cours(request, cours_id):
    user = request.user

    deleted, _ = CoursParticipation.objects.filter(
        user=user,
        cours_id=cours_id
    ).delete()

    if deleted:
        return Response({"message": "Cours quitté"})
    return Response({"error": "Pas inscrit"}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mes_cours(request):
    user = request.user

    participations = CoursParticipation.objects.filter(user=user)

    data = [{
        "id": p.cours.id,
        "titre": p.cours.titre,
        "photo": p.cours.photo,
        "categorie": p.cours.categorie,
        "niveau": p.cours.niveau,
        "objectif_cible": p.cours.objectif_cible,
        "date_inscription": p.date_inscription
    } for p in participations]

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cours_list(request):
    cours = Cours.objects.all()
    data = [{
        "id": c.id,
        "titre": c.titre,
        "categorie": c.categorie,
        "niveau": c.niveau,
        "photo": request.build_absolute_uri(c.photo)
    } for c in cours]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cours_coachs(request, cours_id):
    coachs = CoachCours.objects.filter(cours_id=cours_id).select_related('coach__user')

    data = [{
        "id": cc.coach.id,
        "nom": cc.coach.user.first_name,
        "prenom": cc.coach.user.last_name,
        "specialite": cc.coach.specialite,
        "experience": cc.coach.experience,
        "photo": cc.coach.photo
    } for cc in coachs]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def choisir_coach(request):
    user = request.user
    cours_id = request.data.get("cours_id")
    coach_id = request.data.get("coach_id")

    participation = get_object_or_404(CoursParticipation, user=user, cours_id=cours_id)
    participation.coach_id = coach_id
    participation.save()

    return Response({"message": "Coach sélectionné avec succès"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seances_cours(request, cours_id):
    user = request.user

    p = get_object_or_404(CoursParticipation, user=user, cours_id=cours_id)

    if not p.coach:
        return Response({"error": "Aucun coach sélectionné"}, status=400)

    seances = Seance.objects.filter(cours_id=cours_id, coach=p.coach)

    data = [{
        "id": s.id,
        "date": s.date_seance,
        "heure_debut": s.heure_debut,
        "heure_fin": s.heure_fin,
        "salle": s.salle,
        "statut": s.statut
    } for s in seances]

    return Response(data)

@api_view(['GET'])
def get_coachs_by_cours(request, cours_id):
    coachs = Coach.objects.filter(coachcours__cours_id=cours_id)

    data = [{
        "id": c.id,
        "nom": c.nom,
        "prenom": c.prenom,
        "specialite": c.specialite,
        "experience": c.experience,
        "photo": c.photo,
    } for c in coachs]

    return Response(data)




stripe.api_key = settings.STRIPE_SECRET_KEY


# ------------------------------------------------------------
# 🔥 CRÉATION ABONNEMENT
# ------------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription(request):
    plan = request.data.get("plan")

    PRICES = {
        "monthly": 30,
        "quarterly": 80,
        "annual": 250,
    }

    if plan not in PRICES:
        return Response({"error": "Invalid plan"}, status=400)

    subscription = Subscription.objects.create(
        user=request.user,
        plan=plan,
        price=PRICES[plan],
        status="pending"
    )

    return Response({
        "subscription_id": subscription.id,
        "price": subscription.price
    }, status=201)


# ------------------------------------------------------------
# 🔥 ACTIVATION MANUELLE (rarement utilisée, Stripe gère via webhook)
# ------------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def activate_subscription(request):
    subscription_id = request.data.get("subscription_id")
    transaction_id = request.data.get("transaction_id")

    try:
        sub = Subscription.objects.get(id=subscription_id, user=request.user)
    except Subscription.DoesNotExist:
        return Response({"error": "Subscription not found"}, status=404)

    sub.transaction_id = transaction_id
    sub.activate()

    return Response({"message": "Subscription activated"})


# ------------------------------------------------------------
# 🔥 CRÉATION SESSION DE PAIEMENT STRIPE
# ------------------------------------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_stripe_payment(request):

    subscription_id = request.data.get("subscription_id")

    if not subscription_id:
        return Response({"error": "subscription_id manquant"}, status=400)

    try:
        sub = Subscription.objects.get(id=subscription_id, user=request.user)
    except Subscription.DoesNotExist:
        return Response({"error": "Subscription not found"}, status=404)

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",

            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(sub.price) * 100,  # 💵 CENTS
                    "product_data": {"name": f"Abonnement {sub.plan}"},
                },
                "quantity": 1,
            }],
         success_url="http://localhost:4200/dashboard?session_id={CHECKOUT_SESSION_ID}",

            cancel_url="http://localhost:4200/abonnement",

            metadata={"subscription_id": subscription_id}
        )

        return Response({"payment_url": session.url}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ------------------------------------------------------------
# 🔥 WEBHOOK STRIPE (automatique, aucune authentification)
# ------------------------------------------------------------
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
import stripe
from django.conf import settings
from .models import Subscription

@csrf_exempt
def stripe_webhook(request):
    payload = request.body  # RAW BODY
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    print("\n📌 SIGNATURE REÇUE :", sig_header)

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=endpoint_secret
        )
    except stripe.error.SignatureVerificationError as e:
        print("❌ SIGNATURE INVALIDE :", e)
        return HttpResponse(status=400)
    except Exception as e:
        print("❌ ERREUR :", e)
        return HttpResponse(status=400)

    print("➡️ EVENT :", event["type"])

    if event['type'] == 'checkout.session.completed':
        data = event['data']['object']
        subscription_id = data["metadata"].get("subscription_id")

        try:
            sub = Subscription.objects.get(id=subscription_id)
            sub.transaction_id = data["id"]
            sub.activate()
            print("✔️ Subscription activée")
        except:
            print("❌ Subscription introuvable")

    return HttpResponse(status=200)

# ------------------------------------------------------------
# 🔥 ABONNEMENT ACTIF
# ------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_subscription(request):
    sub = Subscription.objects.filter(
        user=request.user,
        status="active"
    ).order_by("-end_date").first()

    if not sub:
        return Response({"active": False})

    return Response({
        "active": True,
        "subscription_id": sub.id,
        "plan": sub.plan,
        "start_date": sub.start_date,
        "end_date": sub.end_date,
        "price": sub.price
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_seance(request, id):

    user = request.user
    seance = Seance.objects.get(id=id)

    cours = seance.cours
    coach = seance.coach

    # Format du mois actuel → "2025-11"
    month = timezone.now().strftime("%Y-%m")

    # ===========
    # 1️⃣ ANTI–DOUBLE RÉSERVATION LE MÊME JOUR
    # ===========
    same_day_reservation = Seance.objects.filter(
        date_seance=seance.date_seance,   # ton champ
        clients=user
    ).exists()

    if same_day_reservation:
        return Response({
            "error": "❌ Vous avez déjà réservé une séance pour ce jour."
        }, status=400)

    # ===========
    # 2️⃣ ANTI–DOUBLE COURS LE MÊME JOUR
    # (même cours, autre séance)
    # ===========
    same_course_today = Seance.objects.filter(
        cours=cours,
        date_seance=seance.date_seance,
        clients=user
    ).exists()

    if same_course_today:
        return Response({
            "error": "❌ Vous avez déjà une séance pour ce cours aujourd’hui."
        }, status=400)

    # ===========
    # 3️⃣ Coach du mois : vérifier ou attribuer
    # ===========
    selection = ClientCoachSelection.objects.filter(
        user=user,
        cours=cours,
        month=month
    ).first()

    if selection:
        if selection.coach != coach:
            return Response({
                "error": f"❌ Coach du mois : vous êtes déjà avec "
                         f"{selection.coach.prenom} {selection.coach.nom}."
            }, status=400)
    else:
        # Affectation automatique
        ClientCoachSelection.objects.create(
            user=user,
            cours=cours,
            coach=coach,
            month=month
        )

    # ===========
    # 4️⃣ Réserver la séance
    # ===========
    seance.clients.add(user)

    return Response({"success": "✨ Séance réservée avec succès !"})




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_coach_month(request):

    user = request.user
    now = timezone.now()
    mois = now.month
    annee = now.year

    selections = ClientCoachSelection.objects.filter(
    user=user,
    month=timezone.now().strftime("%Y-%m")
).select_related("coach", "cours")


    data = [
        {
            "cours": s.cours.titre,
            "coach_nom": s.coach.nom,
            "coach_prenom": s.coach.prenom,
            "photo": s.coach.photo
        }
        for s in selections
    ]

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_next_seances(request):

    user = request.user
    today = timezone.now().date()

    seances = Seance.objects.filter(
        clients=user,
        date_seance__gte=today
    ).select_related("coach", "cours").order_by("date_seance", "heure_debut")[:3]

    data = [
        {
            "cours": s.cours.titre,
            "coach": f"{s.coach.prenom} {s.coach.nom}",
            "date": s.date_seance,
            "heure": s.heure_debut,
            "salle": s.salle
        }
        for s in seances
    ]

    return Response(data)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_week_seances(request):

    user = request.user
    today = timezone.now().date()
    end = today + timedelta(days=7)

    seances = Seance.objects.filter(
        clients=user,
        date_seance__range=[today, end]
    ).select_related("coach", "cours").order_by("date_seance", "heure_debut")

    data = [
        {
            "cours": s.cours.titre,
            "coach": f"{s.coach.prenom} {s.coach.nom}",
            "date": s.date_seance,
            "heure": s.heure_debut
        }
        for s in seances
    ]

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user

    # Nombre de cours suivis
    cours_count = CoursParticipation.objects.filter(user=user).count()

    # Nombre de coachs rencontrés (coach du mois)
    coachs_count = ClientCoachSelection.objects.filter(user=user).values("coach").distinct().count()

    # Nombre de séances réservées
    seances_count = Seance.objects.filter(clients=user).count()

    return Response({
        "cours": cours_count,
        "coachs": coachs_count,
        "seances": seances_count
    })


from django.http import JsonResponse
from .models import Seance

def seances_by_coach(request):
    cours_id = request.GET.get('cours')
    coach_id = request.GET.get('coach')

    if not cours_id or not coach_id:
        return JsonResponse({"error": "cours et coach obligatoires"}, status=400)

    seances = Seance.objects.filter(
        cours_id=cours_id,
        coach_id=coach_id,
        statut="planifie"
    ).order_by("date_seance", "heure_debut")

    data = [{
        "id": s.id,
        "date_seance": s.date_seance,
        "heure_debut": s.heure_debut,
        "heure_fin": s.heure_fin,
        "salle": s.salle
    } for s in seances]

    return JsonResponse(data, safe=False)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from datetime import date

from .models import Seance


class SeancesByCoach(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cours_id = request.GET.get("cours")
        coach_id = request.GET.get("coach")

        if not cours_id or not coach_id:
            return Response({"error": "cours et coach requis"}, status=400)

        seances = Seance.objects.filter(
            cours_id=cours_id,
            coach_id=coach_id,
            date_seance__gte=date.today()
        ).order_by("date_seance", "heure_debut")

        data = [
            {
                "id": s.id,
                "date_seance": s.date_seance,
                "heure_debut": s.heure_debut,
                "heure_fin": s.heure_fin,
                "salle": s.salle,
            }
            for s in seances
        ]

        return Response(data)


