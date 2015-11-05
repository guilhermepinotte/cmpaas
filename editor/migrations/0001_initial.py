# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Concept',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('text', models.CharField(max_length=200)),
                ('loc', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Map',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, verbose_name='ID', serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(verbose_name='date published')),
            ],
        ),
        migrations.AddField(
            model_name='concept',
            name='idMap',
            field=models.ForeignKey(to='editor.Map'),
        ),
    ]
