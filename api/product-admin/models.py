from django.db import models


class Test(models.Model):
    field = models.CharField(max_length=255)
    product = models.ForeignKey('product-admin.Product', null=True)


class Product(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Variant(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class SKU(models.Model):
    price = models.FloatField()
    product = models.ForeignKey('product-admin.Product')
    variant = models.ForeignKey('product-admin.Variant', null=True, blank=True)

    def __str__(self):
        tpl = '{product}'
        tpl += ' ({variant})' if self.variant else ''
        return tpl.format(
            product=self.product.name,
            variant=self.variant.name if self.variant else '',
            )
