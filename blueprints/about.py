
# Import and setup this blueprint.
from sanic import Blueprint, response

about = Blueprint("about")


@about.route("/about", methods=["GET"])
async def page_about(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("about.html.j2")

    rendered_template = await t.render_async(
        standalone=True
    )

    return response.html(rendered_template)


@about.route("/about/html", methods=["GET"])
async def html_about(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("about.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)
