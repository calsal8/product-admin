from rest_framework import serializers
from . import models


class ProductSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        product_name = validated_data.pop('name')
        product, created = models.Product.objects.get_or_create(name=product_name)
        print('Product: {}, Created: {}'.format(product, created))
        return product

    class Meta:
        model = models.Product
        fields = '__all__'


class VariantSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        variant_name = validated_data.pop('name')
        variant, created = models.Variant.objects.get_or_create(name=variant_name)
        print(created)
        return variant

    class Meta:
        model = models.Variant
        fields = '__all__'


class SKUSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if 'variant_name' in validated_data:
            variant_name = validated_data.pop('variant_name')
        else:
            variant_name = ''
        variant, created = models.Variant.objects.get_or_create(name=variant_name)
        validated_data['variant'] = variant
        sku = models.SKU.objects.create(**validated_data)
        return sku

    variant_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = models.SKU
        fields = 'id', 'price', 'product', 'variant', 'variant_name'


class TestSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = models.Test
        fields = '__all__'
