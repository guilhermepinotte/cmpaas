from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.utils import timezone
from .models import *
from django.views.decorators.csrf import csrf_exempt

import pymongo
import json
# import bson

# from bson import Binary, Code
# from bson.json_util import dumps

from pymongo import MongoClient

def index(request):
    return render(request,'editor/index.html')

@csrf_exempt
def saveMap(request):
    if request.is_ajax():
        if request.method == 'POST':
            dados = json.loads(request.body.decode("utf-8"))
            
            # conecta com o MongoDB
            client = MongoClient()
            # conceta o client com o db_cmpaas 
            db = client.db_cmpaas
            # maps é o nome da collecion dentro do banco de dados db_cmpaas
            db.maps.insert_one(dados)
            # map_id = db.maps.insert_one(dados).inserted_id
            
            # dados é um dicionário <dict> de 2 elementos
            # 1-> dados['nodeDataArray'] é uma lista
                #  dados['nodeDataArray'][0] para acessar os elementos
            # 2-> dados['linkDataArray'] 
            # para adicionar outro campo: dados['created_at'] = timezone.now()

            return HttpResponse('OK')

@csrf_exempt
def loadMap(request):
    if request.is_ajax():
        if request.method == 'GET':
            client = MongoClient()
            db = client.db_cmpaas
            dados = db.maps.find_one()

            # serializa o mapa
            bsonTojson(dados) # ACHAR UMA FORMA MELHOR DE FAZER ISSO

            return JsonResponse(dados)

# recebe um bson do Mongo e retorna um json
def bsonTojson(dados):
    idMap = str(dados['_id'])
    del(dados['_id'])
    dados['_id'] = idMap
