
# Import and setup this blueprint.
from sanic import Blueprint, response

# Import SQLAlchemy modules.
from sqlalchemy import desc

# Import the database connection.
import database

bp_about = Blueprint("about")


@bp_about.route("/about", methods=["GET"])
async def page_about(request):
    # Set the default state of partial requests to false.
    partial = False

    # Check if the partial was specifically requested.
    if request.args.get("partial"):
        if request.args.get("partial") in ["True", "true", "1"]:
            partial = True

    template_env = request.app.config.template_env

    t = template_env.get_template("about.html.j2")

    rendered_template = await t.render_async(
        partial=partial
    )

    return response.html(rendered_template)


@bp_about.route("/about/locations", methods=["GET"])
async def page_about_location(request):
    # Set the default state of partial requests to false.
    partial = False

    # Check if the partial was specifically requested.
    if request.args.get("partial"):
        if request.args.get("partial") in ["True", "true", "1"]:
            partial = True

    # Query the database and get all locations.
    locations = database.db_session.query(database.Location).order_by(desc(database.Location.date)).all()

    template_env = request.app.config.template_env

    t = template_env.get_template("about.locations.html.j2")

    rendered_template = await t.render_async(
        partial=partial,
        locations=locations
    )

    return response.html(rendered_template)


@bp_about.route("/about/setup", methods=["GET"])
async def page_about_tools(request):
    # Set the default state of partial requests to false.
    partial = False

    # Check if the partial was specifically requested.
    if request.args.get("partial"):
        if request.args.get("partial") in ["True", "true", "1"]:
            partial = True

    template_env = request.app.config.template_env

    t = template_env.get_template("about.setup.html.j2")

    rendered_template = await t.render_async(
        partial=partial
    )

    return response.html(rendered_template)
