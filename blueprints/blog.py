
# Import and setup this blueprint.
from sanic import Blueprint, response

blog = Blueprint("blog")


@blog.route("/blog", methods=["GET"])
async def page_blog(request):
    pass


@blog.route("/blog/<entry_id>", methods=["GET"])
async def page_blog_entry(request):
    pass


@blog.route("/blog/html", methods=["GET"])
async def html_blog(request):
    pass


@blog.route("/blog/<entry_id>/html", methods=["GET"])
async def html_blog_entry(request):
    pass
