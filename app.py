
# Import basic Sanic modules.
from sanic import Sanic
from sanic import response

# Get the required packages for rendering templates.
from jinja2 import Environment, PackageLoader, select_autoescape

# Import SCSS parser an d compressor.
from scss.compiler import Compiler

# Import datetime module.
from datetime import datetime

import os
import sys

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
template = template_env.get_template("index.html")


@app.route("/")
async def index(request):
    rendered_template = await template.render_async(
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    return response.html(rendered_template)

if __name__ == "__main__":
    # Compress source files beforehand and move them to the static directory.
    compiler = Compiler()

    print("Building SCSS source files...")

    # Create the static CSS directory.
    if not os.path.exists(os.path.dirname("./static/css/")):
        try:
            os.makedirs(os.path.dirname("./static/css/"))

        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    # Iterate over SCSS source files.
    for filename in os.listdir("./src/scss"):
        if filename.endswith(".scss"):
            # Set the input and output filepaths.
            inpath = os.path.join("./src/scss/", filename)
            outpath = "./static/css/{}.css".format(os.path.splitext(filename)[0])

            # Write the output CSS to the correct path.
            with open(outpath, "w") as f:
                f.write(compiler.compile_string(open(inpath, "r").read()))

            print("{} -> {}".format(inpath, outpath))

            continue

        else:
            continue

    # Run the main application.
    app.run(
        host="0.0.0.0",
        port=8080,
        debug=True
    )
