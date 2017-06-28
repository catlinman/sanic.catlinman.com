
# Import and setup this blueprint.
from sanic import Blueprint, response

contact = Blueprint("contact")


@contact.route("/contact", methods=['GET'])
async def page_contact(request):
    pass


@contact.route("/contact/html", methods=['GET'])
async def html_contact(request):
    pass
