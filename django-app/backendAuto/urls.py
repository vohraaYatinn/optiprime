
from django.urls import include, path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path(r'admin/', admin.site.urls, name="admin"),
    path(r'api/v2/user/', include('UsersDetails.urls'), name="users"),
    path(r'api/v2/orders/', include('orderManagement.urls'), name="orders"),
    path(r'api/v2/coins/', include('CoinsSystem.urls'), name="coins"),
    path(r'api/v2/products/', include('productManagement.urls'), name="products"),
    path(r'api/v2/payments/', include('payments.urls'), name="payments"),

]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static('/pdfs/', document_root=settings.STATICFILES_DIRS[0] + '/pdfs/')
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
