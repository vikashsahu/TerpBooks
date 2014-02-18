from __future__ import absolute_import

from rest_framework import routers

from .views import TextbookViewSet, AuthorViewSet, SemesterViewSet, ProfessorViewSet


router = routers.SimpleRouter()
router.register(r'books', TextbookViewSet, base_name='books')
router.register(r'authors', AuthorViewSet, base_name='authors')
router.register(r'semesters', SemesterViewSet, base_name='semesters')
router.register(r'professors', ProfessorViewSet, base_name='professors')

urlpatterns = router.urls
