from django.db import models
from django.core.validators import RegexValidator

class TownCodes(models.Model):
    town = models.CharField(max_length=255)
    pincode = models.CharField(
        max_length=6,
        validators=[
            RegexValidator(
                regex=r'^\d{2}-\d{3}$',
                message='Pincode must be in the format XX-XXX, e.g., 66-666'
            )
        ]
    )
