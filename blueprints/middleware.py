
# Import and setup this blueprint.
from sanic import Blueprint, response
from sanic_session import InMemorySessionInterface

bp_middleware = Blueprint("middleware")

session_interface = InMemorySessionInterface()


@bp_middleware.middleware
async def return_head(request):
    if request.method == "HEAD":
        return response.text("Head request.")


@bp_middleware.middleware("request")
async def add_session_to_request(request):
    await session_interface.open(request)


@bp_middleware.middleware("response")
async def save_session(request, response):
    await session_interface.save(request, response)
