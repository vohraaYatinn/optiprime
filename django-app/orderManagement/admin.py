from django.contrib import admin
from orderManagement.models import ordersCreated, pendingQuery, lineOrderCreated

# Register your models here.
admin.site.register(lineOrderCreated)

admin.site.register(ordersCreated)
admin.site.register(pendingQuery)
