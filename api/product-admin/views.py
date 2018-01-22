from django.http import JsonResponse
from .models import Product
from rest_framework import viewsets
from django.views.decorators.csrf import csrf_exempt
import json
from . import serializers, models


class TestViewSet(viewsets.ModelViewSet):
    queryset = models.Test.objects.all()
    serializer_class = serializers.TestSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer


class VariantViewSet(viewsets.ModelViewSet):
    queryset = models.Variant.objects.all()
    serializer_class = serializers.VariantSerializer


class SKUViewSet(viewsets.ModelViewSet):
    queryset = models.SKU.objects.all()
    serializer_class = serializers.SKUSerializer

def productList(request):
    allSKUs = Product.objects.values('id', 'name', 'sku', 'sku__variant__name', 'sku__price')
    products = Product.objects.values('id', 'name')
    context = []

    for product in products:
        variantsArr = []
        for sku in allSKUs:
            if sku['sku'] is not None and sku['id']==product['id']:
                variantsArr.append({'sku_id': sku['sku'], 'variant_name': sku['sku__variant__name'], 'price': sku['sku__price']})
        if len(variantsArr) > 0:
            context.append({'id': product['id'], 'name': product['name'], 'variants': variantsArr})

    #context = list(context)
    #print(context)

    return JsonResponse(context, safe=False)

@csrf_exempt
def saveProduct(request):
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    #Get or create instead?
    try:
        product = models.Product.objects.get(pk=data['id'])
    except KeyError:
        product, created = models.Product.objects.get_or_create(name=data['name'])

    product.name = data['name']
    product.save()
    print('Id of saved product: {}'.format(product.id))
    sku_ids = []
    print('Continue..')
    for sku in data['variants']:
        sku_ids.append(sku['sku_id'])
        variant, created = models.Variant.objects.get_or_create(name=sku['variant_name'])
        defaults = {
            'variant': variant,
            'price': sku['price'],
            'product': product,
        }

        skuModel, updated = models.SKU.objects.update_or_create(pk=sku['sku_id'], defaults=defaults)

    models.SKU.objects.filter(product=product).exclude(pk__in=sku_ids).delete()
    #Should always return the product id, even if it didn't receive it in request
    return JsonResponse(data)



def productIdContext(request, id):

    print('Request: {}, id: {}'.format(request, id))
    product = Product.objects.filter(pk=id).values('id', 'name', 'sku', 'sku__variant__name')
    product2 = Product.objects.get(pk=id)

    context = product2
    return JsonResponse(context, safe=False)
