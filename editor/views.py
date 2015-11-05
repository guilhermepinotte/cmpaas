from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
from .models import *

from django.views.decorators.csrf import csrf_exempt

import json

def index(request):
    return render(request,'editor/index.html')

@csrf_exempt
def saveMap(request):
    if request.is_ajax():
        if request.method == 'POST':
            dados = json.loads(request.body.decode("utf-8"))
            print(dados)
            # dados é um dicionário <dict> de 2 elementos
            # 1-> dados['nodeDataArray'] é uma lista
                #  dados['nodeDataArray'][0] para acessar os elementos
            # 2-> dados['linkDataArray'] 
            # para adicionar outro campo: dados['created_at'] = timezone.now()

    return HttpResponse('OK')

# def index(request):
#     latest_map_list = Map.objects.order_by('-created_at')[:5]
#     output = ', '.join([p.title for p in latest_map_list])
#     return HttpResponse(output)

# def detail(request, map_id):
#     return HttpResponse("You're looking at map %s." % map_id)

# def results(request, map_id):
#     response = "You're looking at the results of map %s."
#     return HttpResponse(response % map_id)

# def vote(request, map_id):
#     return HttpResponse("You're voting on map %s." % map_id)