
# catlinman.com #

Repository for my main website written in Python 3.8 and *goin' fast* using
Sanic.

## Development Setup ##

As a security measure, a separate user is created that runs the webserver and
handles ownership of all files within the project. This allows isolation of
files and provides an additional barrier between the system and the
application. Due to this, some steps here will mention a `sanic` user.
Services and the application they spawn run under this user. As such, setup
configuration should also be done under this user.

The first thing you will want to do is create a new virtual environment to
install dependencies to so that they do not interfere with other projects.
Make sure you have virtualenv installed beforehand.

    $ pip install virtualenv ; python3 -m venv venv

This will create a new directory and prepare configuration files. To enter the
new environment simply source the activation binary.

    $ source venv/bin/activate

You can always leave the environment by calling the *deactivate* command.

From here on you can run everything you normally would and it should remain in
the closed system you just created.

## Dependencies ##

To get the server up and running you will have to first install all
dependencies. These are listed in *requirements.txt* which *pip* can read and
install for you.

    $ sudo -u sanic pip3 install -r requirements.txt --no-cache-dir

The main server that takes care of all requests, routing and main functionality
is [Sanic](https://github.com/channelcat/sanic). For the database SQLite3 with
the help of SQLAlchemy is used. To setup the main database you'll want to run
the *setup.py* script in the root directory. This also yields the first launch
administrator password which you will need to get into the admin panel of the
site. asdasd $ python3 setup.py

The site uses a custom build system for handling its resources. For style
sheets it uses SCSS through [libsass](https://github.com/dahlia/libsass-python)
to compile these for the *static* directory of the site. JavaScript is minified
through [jsmin](https://github.com/tikitu/jsmin/) and also sent to the *static*
directory from where all assets are served. Assets are compiled each time the
server is launched. If you want to have instant feedback while developing then
executing *assets.py* is the solution. It will track the *assets* directory
using [watchdog](https://github.com/gorakhargosh/watchdog) and compile any
assets as they are changed and move them to the *static* directory.

## Execution ##

Running the server after all prerequisites have been met is rather simple. All
you have to do is execute the *app.py* script from Python.

    $ python3 app.py

There's also an nginx setup already included in this repository's
*system/nginx* directory which should get things started rather fast. To close
things off you should change the configuration at the end of the *app.py* file
to suit your needs. As it is a part of my website in a sense, my custom
Nextcloud setup configuration of Nekocloud with my LibreOffice Online nginx and
base configuration Nekodocs is also included. You can find the loolwsd config
in *system/loowsd*.

For the server side handling of the process a systemd service script is also
included within the *system/systemd* directory.

The site makes use of [markdown](https://pypi.python.org/pypi/Markdown) for
content rendering and editing of dynamic content. Custom pages and blog entries
are published using markdown. The server renders the markdown and saves it to
the database to avoid recompiling assets each page visit. This means that as a
trade-off, more disc space is used to improve the time of serving content.

## License ##

This repository is released under the MIT license. For more information please
refer to
[LICENSE](https://github.com/catlinman/catlinman.com/blob/master/LICENSE)
