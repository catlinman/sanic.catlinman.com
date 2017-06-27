
from sanic import Blueprint, response

gallery = Blueprint("gallery")


@gallery.route("/gallery", methods=['GET'])
async def page_gallery(request):
    pass


@gallery.route("/gallery/<section>", methods=['GET'])
async def page_gallery_section(request):
    pass


@gallery.route("/gallery/data", methods=['GET'])
async def data_gallery(request):
    pass


@gallery.route("/gallery/<section>/data", methods=['GET'])
async def data_gallery_section(request):
    pass
