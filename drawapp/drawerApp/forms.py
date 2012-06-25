from django import forms

class EmbeddedModelListFormField(forms.Field):
    def prepare_value(self, value):
        return ', '.join(value)

    def to_python(self, value):
        if not value:
            return []
        return value

