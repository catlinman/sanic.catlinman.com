
# Import and setup this blueprint.
from sanic import Blueprint, response

about = Blueprint("about")


@about.route("/about", methods=["GET"])
async def page_about(request):
    pass


@about.route("/about/html", methods=["GET"])
async def html_about(request):
    pass
