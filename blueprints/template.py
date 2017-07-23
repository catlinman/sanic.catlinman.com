
# Import and setup this blueprint.
from sanic import Blueprint, response

bp_template = Blueprint("template")


@bp_template.route("/template/<name>", methods=["GET"])
async def page_template(request, name):
    if(request.app.debug is False):
        return response.redirect("/", status=301)

    try:
        template_env = request.app.config.template_env

        t = template_env.get_template("{}.html.j2".format(name))

        rendered_template = await t.render_async()

        return response.html(rendered_template)

    except(j2.exceptions.TemplateNotFound):
        return response.text("The template of '{}' was not found because you probably spelled it wrong.".format(name))
