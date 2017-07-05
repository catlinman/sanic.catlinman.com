
# Import and setup this blueprint.
from sanic import Blueprint, response

projects = Blueprint("projects")


@projects.route("/projects", methods=["GET"])
async def page_projects(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("projects.html.j2")

    rendered_template = await t.render_async(
        standalone=True
    )

    return response.html(rendered_template)


@projects.route("/projects/<name>", methods=["GET"])
async def page_projects_name(request):
    pass


@projects.route("/projects/html", methods=["GET"])
async def html_projects(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("projects.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)


@projects.route("/projects/<name>/html", methods=["GET"])
async def html_projects_name(request):
    pass
