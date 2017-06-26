
# Import Python modules.
import os
import sys
from datetime import datetime

# Import application modules.
import assets
import database

# Import basic Sanic modules.
from sanic import Sanic, response, exceptions

# Get the required Jinja2 module for rendering templates.
import jinja2 as j2

# Enabling async template execution which allows you to take advantage of newer
# Python features requires Python 3.6 or later.
enable_async = sys.version_info >= (3, 6)

# Create a new Sanic application.
app = Sanic(__name__)

# Setup the static directory.
app.static("/static", "./static")

# Load the template environment with async and jac support.
template_env = j2.Environment(
    loader=j2.PackageLoader("app", "templates"),
    autoescape=j2.select_autoescape(["html", "xml"]),
    enable_async=enable_async
)


@app.exception(exceptions.NotFound)
def not_found(request, exception):
    if(app.debug is False):
        return response.text("Hey stop that. You know {} doesn't exist, right?".format(request.url))


@app.route("/")
async def index(request):
    t = template_env.get_template("index.html.j2")
    rendered_template = await t.render_async(
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    return response.html(rendered_template)


@app.route("/templates/<template_name>", methods=['GET'])
async def show_template(request, template_name):
    if(app.debug is False):
        return response.redirect("/", status=301)

    try:
        t = template_env.get_template("{}.html.j2".format(template_name))

        rendered_template = await t.render_async()

        return response.html(rendered_template)

    except(j2.exceptions.TemplateNotFound):
        return response.text("The template of '{}' was not found because you probably spelled it wrong.".format(template_name))

if __name__ == "__main__":
    # Build all our assets.
    assets.build_assets()

    # Run the main application.
    app.run(
        host="127.0.0.1",
        port=8080,
        workers=4,
        debug=True
    )
