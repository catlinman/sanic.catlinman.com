
# Import Python modules.
import sys

# Import application modules.
import assets
import database
import blueprints

# Import basic Sanic modules.
from sanic import Sanic

# Get the required Jinja2 module for rendering templates.
import jinja2 as j2

# Enabling async template execution which allows you to take advantage of newer
# Python features requires Python 3.6 or later.
enable_async = sys.version_info >= (3, 6)

# Create a new Sanic application.
app = Sanic(name="catlinman.com", register=False)

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

# Add middleware blueprints to this project.
app.blueprint(blueprints.middleware)

# Add all blueprints to this project.
app.blueprint(blueprints.root)
app.blueprint(blueprints.user)
app.blueprint(blueprints.about)
app.blueprint(blueprints.blog)
app.blueprint(blueprints.contact)
app.blueprint(blueprints.error)
app.blueprint(blueprints.gallery)
app.blueprint(blueprints.project)

# Load data blueprints into the data route.
app.blueprint(blueprints.location, url_prefix='/data')
app.blueprint(blueprints.psa, url_prefix='/data')
app.blueprint(blueprints.template, url_prefix='/data')

if __name__ == "__main__":
    # Build all our assets.
    assets.build_assets()

    # Run the main application.
    app.run(
        host="127.0.0.1",
        port=24070,
        workers=1,
        debug=False
    )
