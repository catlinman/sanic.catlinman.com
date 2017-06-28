
# Import and setup this blueprint.
from sanic import Blueprint, response

projects = Blueprint("projects")


@projects.route("/projects", methods=['GET'])
async def page_projects(request):
    pass


@projects.route("/projects/<name>", methods=['GET'])
async def page_projects_name(request):
    pass


@projects.route("/projects/data", methods=['GET'])
async def data_projects(request):
    pass


@projects.route("/projects/<name>/data", methods=['GET'])
async def data_projects_name(request):
    pass
