from django import template
from typing import Sequence, Any, Union

register = template.Library()

@register.filter
def index(sequence: Sequence[Any], position: Union[int, str]) -> Any:
    try:
        idx = int(position)
    except (ValueError, TypeError):
        return ''
    try:
        return sequence[idx]
    except (IndexError, TypeError):
        return ''
