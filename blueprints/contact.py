
# Import and setup this blueprint.
from sanic import Blueprint, response

contact = Blueprint("contact")


@contact.route("/contact", methods=['GET'])
async def page_contact(request):
    pass


@contact.route("/contact/data", methods=['GET'])
async def data_contact(request):
    pass
