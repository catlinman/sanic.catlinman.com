
# Import and setup this blueprint.
from sanic import Blueprint, response

contact = Blueprint("contact")


@contact.route("/contact", methods=["GET"])
async def page_contact(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("contact.html.j2")

    rendered_template = await t.render_async(
        standalone=True
    )

    return response.html(rendered_template)


@contact.route("/contact/html", methods=["GET"])
async def html_contact(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("contact.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)
