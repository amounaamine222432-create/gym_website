from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Adherent,Cours,CoursParticipation,Coach,Seance,CoachCours


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

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


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
        "photo": request.build_absolute_uri(profile.photo.url) if profile.photo else None,
        "date_naissance": adherent.date_naissance,
        "telephone": adherent.telephone,
        "poids": adherent.poids,
        "taille": adherent.taille,
        "objectif": adherent.objectif,
        "niveau": adherent.niveau,
        "frequence_entrainement": adherent.frequence_entrainement,
    }

    return Response(data)


# ---------------------------------------------------------
# 4️⃣ UPDATE PROFIL
# ---------------------------------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_full_profile(request):

    user = request.user
    profile = get_object_or_404(Profile, user=user)
    adherent, _ = Adherent.objects.get_or_create(user=user)

    # Email unique
    email = request.data.get("email")
    if email and email != user.email:
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email déjà utilisé"}, status=400)
        user.email = email

    # Username auto-unique
    new_username = request.data.get("username")
    if new_username and new_username != user.username:
        base_username = new_username
        username = new_username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{i}"
            i += 1
        user.username = username

    user.save()

    # Profil
    profile.first_name = request.data.get("first_name", profile.first_name)
    profile.last_name = request.data.get("last_name", profile.last_name)
    profile.sex = request.data.get("sex", profile.sex)

    if request.data.get("age"):
        profile.age = int(request.data.get("age"))

    if "photo" in request.FILES:
        profile.photo = request.FILES["photo"]

    profile.save()

    # Adherent
    for field in ["date_naissance", "telephone", "objectif", "niveau"]:
        setattr(adherent, field, request.data.get(field, getattr(adherent, field)))

    if request.data.get("poids"):
        adherent.poids = float(request.data.get("poids"))

    if request.data.get("taille"):
        adherent.taille = float(request.data.get("taille"))

    if request.data.get("frequence_entrainement"):
        adherent.frequence_entrainement = int(request.data.get("frequence_entrainement"))

    adherent.save()

    return Response({"message": "Profil mis à jour avec succès"}, status=200)

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