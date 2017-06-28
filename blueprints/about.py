
# Import and setup this blueprint.
from sanic import Blueprint, response

about = Blueprint("about")


@about.route("/about", methods=['GET'])
async def page_about(request):
    pass


@about.route("/about/data", methods=['GET'])
async def data_about(request):
    pass
