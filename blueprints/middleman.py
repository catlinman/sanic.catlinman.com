
# Import and setup this blueprint.
from sanic import Blueprint, response

bp_middleman = Blueprint("middleman")


@bp_middleman.middleware
async def return_head(request):
    if request.method == "HEAD":
        return response.text("Head request.")
