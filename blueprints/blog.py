
# Import and setup this blueprint.
from sanic import Blueprint, response

blog = Blueprint("blog")


@blog.route("/blog", methods=["GET"])
async def page_blog(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("blog.html.j2")

    rendered_template = await t.render_async(
        standalone=True
    )

    return response.html(rendered_template)


@blog.route("/blog/<entry_id>", methods=["GET"])
async def page_blog_entry(request):
    pass


@blog.route("/blog/html", methods=["GET"])
async def html_blog(request):
    template_env = request.app.config.template_env

    t = template_env.get_template("blog.html.j2")

    rendered_template = await t.render_async()

    return response.html(rendered_template)


@blog.route("/blog/<entry_id>/html", methods=["GET"])
async def html_blog_entry(request):
    pass
