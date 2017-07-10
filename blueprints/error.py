
# Import and setup this blueprint.
from sanic import Blueprint, response, exceptions

error = Blueprint("error")


@error.exception(exceptions.SanicException)
async def page_Error(request, exception):
    template_env = request.app.config.template_env

    code = exception.status_code
    cause = ""
    reason = ""

    if status == 403:
        cause = "Access to this page denied!"

        reason = (
            "You're probably missing the correct credentials to access this page. "
            "It's there but you're just not allowed to see it. No peeking please."
        )

    elif status == 404:
        cause = "The page you are looking for was not found!"

        reason = (
            "If you are 100% sure that there should be a page here please contact "
            "the site administrator about this. Would be a shame if "
            "others encountered the same problem!"
        )

    elif status > 500:
        cause = "An internal server error occured!"

        reason = (
            "This is not very good. Let's hope the server hasn't caught fire "
            "because of you accessing this page. You should contact the site "
            "administrator as soon as possible about this because in any case "
            "it's bad and should get fixed!"
        )

    t = template_env.get_template("error.html.j2")

    rendered_template = await t.render_async(
        status=status,
        cause=cause,
        reason=reason
    )

    return response.html(
        rendered_template,
        status=status
    )
