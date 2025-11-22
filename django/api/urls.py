from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
import api.views as views


urlpatterns = [

    # -------------------------
    # 🔐 AUTHENTIFICATION
    # -------------------------
    path('register/', views.register, name='register'),
    path('token/', views.EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # -------------------------
    # 👤 USER
    # -------------------------
    path("user/profile/", views.full_profile),
    path("user/update-profile/", views.update_full_profile),
    path("user/status", views.user_status),

    # -------------------------
    # 📚 COURS
    # -------------------------
    path("cours/", views.get_cours),
    path("cours/list/", views.cours_list),
    path("cours/mes/", views.mes_cours),
    path("cours/join/", views.rejoindre_cours),
    path("cours/quit/<int:cours_id>/", views.quitter_cours),

    # Coachs & séances
    path("cours/coachs/<int:cours_id>/", views.cours_coachs),
    path("cours/choisir-coach/", views.choisir_coach),
    path("cours/seances/<int:cours_id>/", views.seances_cours),
    path("cours/<int:cours_id>/coachs/", views.get_coachs_by_cours),

    # Vidéos IA
    path("cours/<int:cours_id>/videos-ai/", views.get_course_videos_ai, name="videos-ai"),

    # -------------------------
    # 🟦 SUBSCRIPTION
    # -------------------------
    path('subscription/create/', views.create_subscription),
    path('subscription/me/', views.my_subscription),
    path('subscription/activate/', views.activate_subscription),

    # -------------------------
    # 💳 STRIPE
    # -------------------------
    path("stripe/create/", views.create_stripe_payment),
    path("stripe/webhook/", views.stripe_webhook),

    # -------------------------
    # 📊 DASHBOARD
    # -------------------------
    path('dashboard/coach-month/', views.get_my_coach_month),
    path('dashboard/next-seances/', views.get_my_next_seances),
    path('dashboard/week-seances/', views.get_my_week_seances),
    path('dashboard/stats/', views.dashboard_stats),

    # -------------------------
    # 📝 AVIS
    # -------------------------
    path('avis/my-data/', views.get_my_cours_and_coachs),
    path('avis/submit/', views.submit_reviews),

    # -------------------------
    # 📅 SEANCES
    # -------------------------
    path("seances/", views.seances_by_coach),
    path("seances/coach/<int:coach_id>/", views.SeancesByCoach.as_view()),
    path("seances/<int:id>/join/", views.join_seance),
]
