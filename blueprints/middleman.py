
# Import and setup this blueprint.
from sanic import Blueprint, response

middleman = Blueprint("middleman")


@middleman.middleware
async def return_head(request):
    if request.method == "HEAD":
        return response.text("Head request.")
