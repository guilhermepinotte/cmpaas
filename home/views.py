from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

import datetime
from django.utils.timezone import utc

import pymongo
import json
import bson

from pymongo import MongoClient

def index(request):
    return render(request,'home/index.html')

def saveUser(request):
    if request.method == 'POST':
        try:
            user = {}
            user['username'] = request.POST['username']
            user['email'] = request.POST['email']
            user['password'] = request.POST['password']
            # user['date-register'] = datetime.datetime.utcnow().replace(tzinfo=utc).strftime('%Y-%m-%d %H:%M:%S')
            user['date-register'] = datetime.datetime.now()

            print(user)

        except KeyError:
            return render(request,'home/index.html',
                {'error_message': "Erro no cadastro"})
        else: # no error occured
            client = MongoClient()
            db = client.db_cmpaas
            db.users.insert_one(user)

            print(' It worked! ')
            return render(request,'home/index.html',
                {'sucess_message': "Usuário cadastrado com sucesso"})