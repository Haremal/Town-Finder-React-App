import json

from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from .models import TownCodes

def get_town_list(request):
    towns = TownCodes.objects.all().values('id', 'town', 'pincode')
    return JsonResponse(list(towns), safe=False)

@csrf_exempt
def search_towns(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        town_query = data.get('town', '').strip()
        pincode_query = data.get('pincode', '').strip()

        queryset = TownCodes.objects.all()

        if town_query:
            queryset = queryset.filter(town__icontains=town_query)
        if pincode_query:
            queryset = queryset.filter(pincode__icontains=pincode_query)

        results = list(queryset.values('id', 'town', 'pincode'))
        return JsonResponse(results, safe=False)

    return JsonResponse({'error': 'Only POST allowed'}, status=405)


@csrf_exempt
def add_town(request):
    if request.method == 'OPTIONS':
        # Respond to preflight CORS check
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == 'POST':
        data = json.loads(request.body)
        town = data.get('town')
        pincode = data.get('pincode')
        town_obj = TownCodes(town=town, pincode=pincode)
        try:
            town_obj.full_clean()  # This triggers all model validations, including RegexValidator
        except ValidationError as e:
            return JsonResponse({'error': e.message_dict}, status=400)
        town_obj.save()

        return JsonResponse({'id': town_obj.id})
    return JsonResponse({'error': 'Only POST allowed'}, status=405)


@csrf_exempt
def delete_town(request, id):
    if request.method == 'DELETE':
        town = get_object_or_404(TownCodes, id=id)
        town.delete()
        return JsonResponse({'status': 'deleted'})
    return JsonResponse({'error': 'Only DELETE allowed'}, status=405)