
# Import Python modules.
import sys
from datetime import datetime

# Import application modules.
from assets import *

# Import basic Sanic modules.
from sanic import Sanic
from sanic import response

# Get the required packages for rendering templates.
from jinja2 import Environment, PackageLoader, select_autoescape

# Enabling async template execution which allows you to take advantage of newer Python features requires Python 3.6 or later.
enable_async = sys.version_info >= (3, 6)

# Create a new Sanic application.
app = Sanic(__name__)

# Setup the static directory.
app.static("/static", "./static")

# Load the template environment with async and jac support.
template_env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(["html", "xml"]),
    enable_async=enable_async
)

# Load the template from file.
template = template_env.get_template("index.j2")


@app.route("/")
async def index(request):
    rendered_template = await template.render_async(
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    return response.html(rendered_template)

if __name__ == "__main__":
    # Build all our assets.
    build_assets()

    # Run the main application.
    app.run(
        host="0.0.0.0",
        port=8080,
        debug=True
    )
