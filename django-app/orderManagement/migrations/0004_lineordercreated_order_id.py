# Generated by Django 5.0 on 2024-01-07 09:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orderManagement', '0003_remove_orderscreated_product_obj_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='lineordercreated',
            name='order_id',
            field=models.ForeignKey(max_length=100, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_id', to='orderManagement.orderscreated'),
        ),
    ]
