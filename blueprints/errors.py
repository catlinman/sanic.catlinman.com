
# Import and setup this blueprint.
from sanic import Blueprint, response, exceptions

errors = Blueprint("errors")


@errors.exception(exceptions.SanicException)
async def page_Error(request, exception):
    if exception.status_code == 403:
        template_env = request.app.config.template_env

        t = template_env.get_template("403.html.j2")

        rendered_template = await t.render_async()

        return response.html(rendered_template)


@errors.exception(exceptions.NotFound)
async def page_404(request, exception):
    template_env = request.app.config.template_env

    t = template_env.get_template("404.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)


@errors.exception(exceptions.ServerError)
async def page_500(request, exception):
    template_env = request.app.config.template_env

    t = template_env.get_template("500.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)
