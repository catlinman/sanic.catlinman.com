
# catlinman.com #

Repository for my main website written in Python 3.6 and *goin' fast* using Sanic.

## Setup ##

To get the server up and running you will have to first install all dependencies.
These are listed in *requirements.txt* which *pip* can read and install for you.

    $ pip install -r requirements.txt

The main server that takes care of all requests, routing and main functionality
is [Sanic](https://github.com/channelcat/sanic). For the database SQLite3 with
the help of SQLAlchemy is used. To setup the main database you'll want to run
the *setup.py* script in the root directory. This also yields the first launch
administrator password which you will need to get into the admin panel of the
site.

    $ python3 setup.py

The site uses a custom build system for handling its resources. For style sheets
it uses SCSS through [libsass](https://github.com/dahlia/libsass-python) to
compile these for the *static* directory of the site. JavaScript is minified
through [jsmin](https://github.com/tikitu/jsmin/) and also sent to
the *static* directory from where all assets are served. Assets are compiled
each time the server is launched. If you want to have instant feedback while
developing then executing *assets.py* is the solution. It will track the
*assets* directory using [watchdog](https://github.com/gorakhargosh/watchdog)
and compile any assets as they are changed and move them to the *static*
directory.

Running the server after all prerequisites have been met is rather simple. All
you have to do is execute the *app.py* script from Python.

    $ python3 app.py

There's also an nginx setup already included in this repository's *nginx*
directory which should get things started rather fast. To close things off
you should change the configuration at the end of the *app.py* file to suit
your needs. As it is a part of my website in a sense, my custom Nextcloud
setup configuration of Nekocloud is also included.

The site makes use of [markdown](https://pypi.python.org/pypi/Markdown) for
content rendering and editing of dynamic content. Custom pages and blog entries
are published using markdown. The server renders the markdown and saves it to
the database to avoid recompiling assets each page visit. This means that as a
trade-off, more disc space is used to improve the time of serving content.

## License ##

This repository is released under the MIT license. For more information please
refer to
[LICENSE](https://github.com/catlinman/catlinman.com/blob/master/LICENSE)
