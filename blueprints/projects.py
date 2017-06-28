
# Import and setup this blueprint.
from sanic import Blueprint, response

projects = Blueprint("projects")


@projects.route("/projects", methods=['GET'])
async def page_projects(request):
    pass


@projects.route("/projects/<name>", methods=['GET'])
async def page_projects_name(request):
    pass


@projects.route("/projects/html", methods=['GET'])
async def html_projects(request):
    pass


@projects.route("/projects/<name>/html", methods=['GET'])
async def html_projects_name(request):
    pass
