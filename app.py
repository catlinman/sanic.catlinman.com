
# Import Python modules.
import sys

# Import application modules.
import assets
import database
import blueprints

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
    enable_async=enable_async,
    trim_blocks=True,
    lstrip_blocks=True
)

app.config.template_env = template_env


@app.exception(exceptions.NotFound)
async def page_404(request, exception):
    if(app.debug is False):
        return response.text("Hey stop that. You know {} doesn't exist, right?".format(request.url))

# Add all blueprints to this project.
app.blueprint(blueprints.root)
app.blueprint(blueprints.about)
app.blueprint(blueprints.blog)
app.blueprint(blueprints.contact)
app.blueprint(blueprints.gallery)
app.blueprint(blueprints.middleman)
app.blueprint(blueprints.projects)
app.blueprint(blueprints.psa)
app.blueprint(blueprints.templates)

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
