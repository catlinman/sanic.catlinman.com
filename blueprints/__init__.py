
# Configure the module to make importing of blueprints with the syntax of
# 'import blueprints -> blueprints.page' possible.
from .root import root
from .about import about
from .blog import blog
from .contact import contact
from .gallery import gallery
from .projects import projects
from .templates import templates

__all__ = [
    "about",
    "blog",
    "contact",
    "gallery",
    "projects",
    "templates"
]
