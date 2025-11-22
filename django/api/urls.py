from django.urls import path
import api.views as views  
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    cours_list, mes_cours, rejoindre_cours, quitter_cours,
    get_cours, cours_coachs, choisir_coach, seances_cours,
    get_coachs_by_cours,
    create_subscription, my_subscription, activate_subscription,
    create_stripe_payment, stripe_webhook,get_my_coach_month,get_my_next_seances,get_my_week_seances,dashboard_stats
)
from django.urls import path
from .views import SeancesByCoach, join_seance,get_coachs_by_cours
urlpatterns = [
    # 🔐 Auth
    path('register/', views.register, name='register'),
    path('token/', views.EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 👤 User
    path("user/profile/", views.full_profile, name="full-profile"),
    path("user/update-profile/", views.update_full_profile, name="update-full-profile"),
    path("user/status", views.user_status, name="user-status"),

    # 📚 Cours & Coachs
    path("cours/", get_cours),
    path("cours/list/", cours_list),
    path("cours/mes/", mes_cours),
    path("cours/join/", rejoindre_cours),
    path("cours/quit/<int:cours_id>/", quitter_cours),

    path("cours/coachs/<int:cours_id>/", cours_coachs),
    path("cours/choisir-coach/", choisir_coach),
    path("cours/seances/<int:cours_id>/", seances_cours),
    path("cours/<int:cours_id>/coachs/", get_coachs_by_cours),

    # 🟦 Subscription
    path('subscription/create/', create_subscription),
    path('subscription/me/', my_subscription),
    path('subscription/activate/', activate_subscription),

    # 💳 STRIPE
    path("stripe/create/", create_stripe_payment, name="stripe-create"),
    path("stripe/webhook/", stripe_webhook, name="stripe-webhook"),

path("seances/", views.seances_by_coach),


    path("seances/coach/<int:coach_id>/", SeancesByCoach.as_view()),
    path("seances/<int:id>/join/", join_seance),

path('dashboard/coach-month/', get_my_coach_month),
path('dashboard/next-seances/', get_my_next_seances),
path('dashboard/week-seances/', get_my_week_seances),
path("dashboard/stats/", dashboard_stats),

]
