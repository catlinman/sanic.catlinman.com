
# Import Python modules.
from datetime import datetime

# Import and setup this blueprint.
from sanic import Blueprint, response

root = Blueprint("root")


@root.route("/", methods=["GET"])
async def page_root(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("base.html.j2")

    rendered_template = await t.render_async(
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    return response.html(rendered_template)
