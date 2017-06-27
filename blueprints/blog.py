
from sanic import Blueprint, response

blog = Blueprint("blog")


@blog.route("/blog", methods=['GET'])
async def page_blog(request):
    pass


@blog.route("/blog/<entry_id>", methods=['GET'])
async def page_blog_entry(request):
    pass


@blog.route("/blog/data", methods=['GET'])
async def data_blog(request):
    pass


@blog.route("/blog/<entry_id>/data", methods=['GET'])
async def data_blog_entry(request):
    pass
