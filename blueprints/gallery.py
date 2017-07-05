
# Import and setup this blueprint.
from sanic import Blueprint, response

gallery = Blueprint("gallery")


@gallery.route("/gallery", methods=["GET"])
async def page_gallery(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("gallery.html.j2")

    rendered_template = await t.render_async(
        standalone=True
    )

    return response.html(rendered_template)


@gallery.route("/gallery/<section>", methods=["GET"])
async def page_gallery_section(request):
    pass


@gallery.route("/gallery/html", methods=["GET"])
async def html_gallery(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("gallery.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)


@gallery.route("/gallery/<section>/html", methods=["GET"])
async def html_gallery_section(request):
    pass
