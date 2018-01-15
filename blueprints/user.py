# Import and setup this blueprint.
from sanic import Blueprint, response

# Import SQLAlchemy modules.
from sqlalchemy import desc

# Import the database connection.
import database

bp_user = Blueprint("user")


@bp_user.route("/user/login", methods=["GET", "POST"])
async def page_about(request):
    # Set the default state of partial requests to false.
    partial = False

    # Check if the partial was specifically requested.
    if request.args.get("partial"):
        if request.args.get("partial") in ["True", "true", "1"]:
            partial = True

    template_env = request.app.config.template_env

    t = template_env.get_template("user.login.html.j2")

    rendered_template = await t.render_async(
        partial=partial
    )

    return response.html(rendered_template)
