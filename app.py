
# Import basic Sanic modules.
from sanic import Sanic
from sanic import response

# Get the required packages for rendering templates.
from jinja2 import Environment, PackageLoader, select_autoescape

# Import datetime module.
from datetime import datetime

import sys

# Enabling async template execution which allows you to take advantage of newer Python features requires Python 3.6 or later.
enable_async = sys.version_info >= (3, 6)

# Create a new Sanic application.
app = Sanic(__name__)

# Load the template environment with async support.
template_env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(["html", "xml"]),
    enable_async=enable_async
)

# Load the template from file.
template = template_env.get_template("index.html")


@app.route("/")
async def test(request):
    rendered_template = await template.render_async(
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    return response.html(rendered_template)

app.run(host="127.0.0.1", port=8080, debug=True)
