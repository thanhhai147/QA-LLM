# Generated by Django 5.1.3 on 2024-11-13 07:10

import QALLM.validators.custom_validators
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('session_id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_name', models.TextField(max_length=12, validators=[QALLM.validators.custom_validators.AdancedValidator.check_user_name, django.core.validators.MinLengthValidator(6)])),
                ('password', models.TextField(max_length=24, validators=[QALLM.validators.custom_validators.AdancedValidator.check_password, django.core.validators.MinLengthValidator(6)])),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('chat_id', models.AutoField(primary_key=True, serialize=False)),
                ('chat_position', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('user_ask', models.TextField(max_length=4000, validators=[django.core.validators.MinLengthValidator(1)])),
                ('bot_answer', models.TextField(max_length=4000, validators=[django.core.validators.MinLengthValidator(1)])),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('session_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='QALLM.session')),
            ],
        ),
        migrations.AddField(
            model_name='session',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='QALLM.user'),
        ),
    ]
