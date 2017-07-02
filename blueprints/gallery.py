
# Import and setup this blueprint.
from sanic import Blueprint, response

gallery = Blueprint("gallery")


@gallery.route("/gallery", methods=["GET"])
async def page_gallery(request):
    pass


@gallery.route("/gallery/<section>", methods=["GET"])
async def page_gallery_section(request):
    pass


@gallery.route("/gallery/html", methods=["GET"])
async def html_gallery(request):
    pass


@gallery.route("/gallery/<section>/html", methods=["GET"])
async def html_gallery_section(request):
    pass
