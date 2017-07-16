
# Import and setup this blueprint.
from sanic import Blueprint, response, exceptions

error = Blueprint("error")

# Handling function for errors. Used in standalone responses (exceptions) and
# in partial responses (AJAX 404 responses).


async def render_error(request, status, partial):
    template_env = request.app.config.template_env

    # Make sure that our status code is actually a number.
    if type(status) is str:
        if not status.isdigit():
            status = 404

        else:
            status = int(status)

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

    elif status >= 500 and status < 600:
        cause = "An internal server error occured!"

        reason = (
            "This is not very good. Let's hope the server hasn't caught fire "
            "because of you accessing this page. You should contact the site "
            "administrator as soon as possible about this because in any case "
            "it's bad and should get fixed!"
        )

    elif status >= 600:
        cause = "Stop trying to break error page handling!"

        reason = (
            "It's nice to see that you are having fun with unknown response status statuss "
            "but I would like to inform you that there is more to life than making "
            "requests to error pages on some person's website that do not make sense. "
            "If you do however break something. Please tell me okay?"
        )

    t = template_env.get_template("error.html.j2")

    rendered_template = await t.render_async(
        partial=partial,
        status=status,
        cause=cause,
        reason=reason
    )

    # If this is a partial request we want to make sure that the data gets passed.
    if partial is True:
        status = 200

    return response.html(
        rendered_template,
        status=status
    )


@error.route("/error/<status>", methods=["GET"])
async def page_error(request, status):
    # Set the default state of partial requests to false.
    partial = False

    # Check if the partial was specifically requested.
    if request.args.get("partial"):
        if request.args.get("partial") in ["True", "true", "1"]:
            partial = True

    # Only serve the error information partial if the partial parameter was added.
    if partial is True:
        return await render_error(request, status, partial)

    # Otherwise discard the path and render a 404 page.
    else:
        return await render_error(request, 404, False)


@error.exception(exceptions.SanicException)
async def exception_error(request, exception):
    return await render_error(request, exception.status_code, False)
