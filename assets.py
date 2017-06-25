
# Helper file for building assets. If run on its own creates an asset watchdog.

# Import Python modules.
import os
import sys
import time
from datetime import datetime

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Import SASS parser and compressor.
import sass

# Specifiy constants for the file paths.
SCSS_PATH = "./static/scss/"
CSS_PATH = "./static/css/"


def build_scss(filename):
    # Create the output CSS directory if doesn't exist.
    if not os.path.exists(os.path.dirname(CSS_PATH)):
        try:
            os.makedirs(os.path.dirname(CSS_PATH))

        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    # Get the full paths to the files.
    srcpath = os.path.join(SCSS_PATH, filename)
    outpath = "{}{}.css".format(CSS_PATH, os.path.splitext(filename)[0])

    # Write the output CSS to the correct path.
    with open(outpath, "w") as f:
        f.write(
            sass.compile(
                string=open(srcpath, "r").read(),
                output_style="compressed"
            )
        )

    print("SCSS built: {} -> {}".format(srcpath, outpath))


def build_assets():
    # Compress source files beforehand and move them to the static directory.
    print("Building SCSS source files...")

    # Iterate over SCSS source files.
    for filename in os.listdir("./static/scss"):
        if filename.endswith(".scss"):
            # Build the CSS file from the detected SCSS file.
            build_scss(filename)

            continue

        else:
            continue


class SCSSHandler(FileSystemEventHandler):
    def on_modified(self, event):
        filename = os.path.basename(event.src_path)

        print("\n{} - Detected a change in '{}'.".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), filename))

        # Rebuild the detected file.
        build_scss(filename)


if __name__ == "__main__":
    # Build all our assets for use in the application.
    build_assets()

    # Setup a watchdog for the build asset directories.
    scss_handler = SCSSHandler()

    observer = Observer()
    observer.schedule(scss_handler, SCSS_PATH, recursive=False)
    observer.start()

    print("\nStarted watchdog for '{}*'.".format(SCSS_PATH))

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        observer.stop()

    observer.join()
