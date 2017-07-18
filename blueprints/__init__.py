
# Configure the module to make importing of blueprints with the syntax of
# 'import blueprints -> blueprints.content' possible.
from .root import root
from .about import about
from .blog import blog
from .contact import contact
from .error import error
from .gallery import gallery
from .location import location
from .middleman import middleman
from .project import project
from .psa import psa
from .template import template

__all__ = [
    "about",
    "blog",
    "contact",
    "error",
    "gallery",
    "location",
    "middleman",
    "project",
    "psa",
    "template"
]
