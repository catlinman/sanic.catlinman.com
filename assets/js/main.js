// Variables used by other scripts that should be overwritten.
var mapbox;

/**
 * Capitalizes the base string. Mutates the base object.
 * @return {string} Capitalized string result.
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Sets a cookie value by its key and specifies an expiration date.
 * @param {string} name  Key name of the cookie to be set.
 * @param {string} value The value of the cookie to set.
 * @param {number} days  The amount of days this cookie has before it expires.
 */
function setCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();

    } else {
        expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}
/**
 * Gets a cookie by its key name.
 * @param  {string} name Key name of the cookie to retrieve.
 * @return {string} The found cookie's value as a string.
 */
function getCookie(name) {
    if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(name + "=");

        if (start != -1) {

            start = start + name.length + 1;
            var end = document.cookie.indexOf(";", start);

            if (end == -1) {
                end = document.cookie.length;
            }

            return unescape(document.cookie.substring(start, end));
        }
    }

    return "";
}

$(function() {
    // Variables storing states of the page segments.
    var currentPath = "";
    var footerActive = false;
    var contentActive = false;
    var effectsActive = true;

    /**
     * Set the state of the page effects.
     * @param {boolean} state The boolean enabled state to be set.
     */
    function setEffectsState(state) {
        // Check which state we are setting at the moment.
        if (state === false) {
            // Fade out the background.
            $(".fx").fadeOut(function() {
                // Tell the scene to pause on successful completion.
                scenePaused = true;
            })

            // Construct the base filter string to apply vendor prefixes to.
            var filterVal = "blur(0px)"

            // Set the CSS of background elements and blur them out.
            $(".background-blur").css("filter", filterVal)
                .css("webkitFilter", filterVal)
                .css("mozFilter", filterVal)
                .css("oFilter", filterVal)
                .css("msFilter", filterVal);

        } else {
            // Enable scene logic again.
            scenePaused = false;

            // Fade in the effects elements.
            $(".fx").fadeIn();
        }

        // Set a cookie storing the scene FX state.
        setCookie("fx-enabled", state, 2147483647);

        // Set the tracking variable used in other parts of this script.
        effectsActive = state;
    }

    // Track clicking on the control-fx button. Toggle effects if pressed.
    $(".control-fx").click(function() {
        setEffectsState(!effectsActive);
    });

    /**
     * Set the state of the footer menu. Open and close it accordingly.
     * @param {boolean} state The boolean enabled state to be set.
     */
    function setFooterState(state) {
        if (state === true) {
            // Slide up the footer menu and flip the anchor.
            $(".footer-content").slideDown();
            $(".footer-anchor").css("transform", "scaleY(-1) translate(0px, 10px)");

        } else {
            // Slide down the footer menu if it's disabled. Reset the anchor as well.
            $(".footer-content").slideUp();
            $(".footer-anchor").css("transform", "");
        }

        // Set the tracking variable used in other parts of this script.
        footerActive = state;
    }

    // Track clicking on the footer handle. Toggle the footer if pressed.
    $(".footer-handle").click(function() {
        setFooterState(!footerActive);
    });

    /**
     * Set the navigation bar highlight depending on the path specified.
     * @param {string} path The path of the page to check for path matches.
     */
    function setNavigationPath(path) {
        // Remove starting slash if it is present.
        if (path.charAt(0) == "/") path = path.slice(1);

        // Get the root of the specified path.
        var pathroot = path.split("/")[0];

        // Iterate over the navigation bar items.
        $("nav a").each(function() {
            // Split this element's link to get the root path.
            var linksplit = this.href.split("/")
            var linkroot = linksplit[linksplit.length - 1];

            if (linkroot.toLowerCase() == pathroot) {
                // Check if it matches up. If so change the highlight border CSS
                $(this).css("border-top", "4px solid #fece7e");

            } else {
                // If this is not the case reset the CSS.
                $(this).css("border-top", "");
            }
        });
    }

    // Variables used for content loading of the page.
    var pageTitle = "Catlinman";
    var pagePARTIAL = "?partial=true";
    var pageERROR = "/error/";

    /**
     * Request and load the specified path of the page into the content container.
     * @param  {string} path The absolute path of the page to load on the current site.
     * @param  {boolean} replace If this page loading should replace a history step.
     * @param  {boolean} standalone If page content is already loaded and should only be shown.
     */
    function contentLoad(path, hash, replace, standalone) {
        // Set the current changed path.
        currentPath = path;

        if (hash == "") {
            if (replace === true) {
                // Replace the history state if specified.
                history.replaceState(path, path, path);

            } else {
                // Otherwise push this page on the history stack.
                history.pushState(path, path, path);
            }
        }

        if (path != "" && path != "/") {
            // If the path is not the root path set the right nav menu selection.
            setNavigationPath(path);

            // Set the content state of the page to active.
            contentActive = true;

            // If effects are eneabled set the right values for these.
            if (effectsActive === true) {
                // Set the filter variable to be used for the CSS of blur elements.
                var filterVal = "blur(4px)"

                // Apply the prepared CSS filter but add vendor prefixes now.
                $(".background-blur").css("filter", filterVal)
                    .css("webkitFilter", filterVal)
                    .css("mozFilter", filterVal)
                    .css("oFilter", filterVal)
                    .css("msFilter", filterVal);
            }

            // If page content is already present skip further loading.
            if (standalone === true) {
                $("#psa").fadeOut()
                $(".content").fadeIn(function() {
                    // Resize the any mapbox present on the page.
                    if (mapbox) {
                        mapbox.resize();
                        mapbox.repaint = true;
                    }
                }).css("display", "block");

                // Check if the path contains an anchor. If so scroll to it.
                if (hash != "") contentScroll(hash, false);

                return;
            };

            // Progress bar variables.
            var progress = 50;
            var progressSmoothed = 0;

            // Fade in the progress bar and handle progress bar logic from there.
            $("progress").fadeIn(0.5, function() {
                // Get the progress bar element and assign it to an easier to handle variable.
                var p = $(this);

                // Create an animation loop for the progress bar animation.
                var loop = setInterval(function() {
                    if (progressSmoothed < 99.75) {
                        // If smoothed value of the progress bar is below the threshold, calculate the next step..
                        progressSmoothed = progressSmoothed + (progress - progressSmoothed) * 0.05;

                        if (p.hasClass("progress-reverse")) {
                            // Set the right value for the progress bar if it's the reversed one.
                            p.val(100 - progressSmoothed);

                        } else {
                            // Otherwise just set the current smoothed value of the progress bar.
                            p.val(progressSmoothed);
                        }

                    } else {
                        // If we have passed the threshold reset the progress bar variables.
                        var reset = 0;

                        // Invert this for the reversed bar.
                        if (p.hasClass("progress-reverse")) {
                            reset = 100;
                        }

                        // Fade out the progress bars and set the correct values accordingly.
                        p.fadeOut(function() {
                            p.val(reset);
                        });

                        // Clear the animation loop as it is not required anymore.
                        clearInterval(loop);
                    }
                }, 1000 / 60); // Set a 60 frames per second frame rate.
            });

            // Make a get request to our content end point.
            $.ajax({
                url: path + pagePARTIAL,
                type: "get",

                error: function(xhr, status) {
                    // Set the progress of the loading bars to the completed value.
                    progress = 100;

                    document.title = pageTitle + " - " + xhr.status;

                    // Make another request to the correct error page handler.
                    $.get(pageERROR + xhr.status + pagePARTIAL, function(data) {
                        // Set the content of our content container to the returned data.
                        $(".content").html(data);

                        // Fade out background elements and fade in content elements.
                        $("#psa").fadeOut()
                        $(".content").fadeIn().css("display", "block");
                    });
                },

                success: function(data) {
                    // Set the progress of the loading bars to the completed value.
                    progress = 100;

                    /*
                        Failsafe check if an entire page was served.

                        This is required for cases where error pages and other content
                        with no separate path for HTML is served. The tags need to be
                        specified in the template files for this to work. Otherwise
                        page recursion might occur.
                    */
                    if (data.indexOf("content-standalone") > -1) {
                        var contentStart = data.indexOf("<div class=\"content-standalone-start");
                        var contentEnd = data.indexOf("<div class=\"content-standalone-end\"></div>");

                        data = data.slice(contentStart, contentEnd);
                    }

                    if (path != "/") {
                        var titleSplit = "<div content-title=\"".length;
                        var titleStart = data.indexOf("<div content-title=\"");
                        var titleEnd = data.indexOf("\" class=\"content-title\"></div>");

                        var title = (titleEnd != -1 ? data.slice(titleStart + titleSplit, titleEnd) : "");

                        if (title != "") document.title = pageTitle + " - " + title;
                        else document.title = pageTitle + " - " + (path.charAt(0) == "/" ? path.slice(1) : path).capitalize();

                    } else {
                        document.title = pageTitle;
                    }

                    // Set the content of our content container to the returned data.
                    $(".content").html(data);

                    // Fade out background elements and fade in content elements.
                    $("#psa").fadeOut()
                    $(".content").fadeIn(function() {
                        // Resize the any mapbox present on the page.
                        if (mapbox) {
                            mapbox.resize();
                            mapbox.repaint = true;
                        }
                    }).css("display", "block");

                    // Check if the path contains an anchor. If so scroll to it.
                    if (hash != "") contentScroll(hash, replace);
                }
            });

        } else {
            // If this is the root page disable the content mode.
            contentActive = false;

            // Reset the page title.
            document.title = pageTitle;

            // Prepare the filter variable for futher CSS:
            var filterVal = "blur(0px)"

            // Reset all background filter elements and apply vendor prefixes.
            $(".background-blur").css("filter", filterVal)
                .css("webkitFilter", filterVal)
                .css("mozFilter", filterVal)
                .css("oFilter", filterVal)
                .css("msFilter", filterVal);

            // Fade out the content container.
            $(".content").fadeOut();
        }
    }

    function contentScroll(target, replace) {
        // Check if the element exists.
        if (!$(target).length && target !== "#top") return;

        if (target !== "#top") {
            // Set the current changed path.
            currentPath = location.pathname + target

            if (replace === true) {
                // Replace the history state if specified.
                history.replaceState(currentPath, currentPath, currentPath);

            } else {
                // Otherwise push this page on the history stack.
                history.pushState(currentPath, currentPath, currentPath);
            }

            $('html,body').animate({
                scrollTop: ($(target).offset().top - 74)
            }, 1000, "swing");

        } else {
            $('html,body').animate({
                scrollTop: 0
            }, 1000, "swing");

            if (replace === true) {
                // Replace the history state if specified.
                history.replaceState(location.pathname, location.pathname, location.pathname);

            } else {
                // Otherwise push this page on the history stack.
                history.pushState(location.pathname, location.pathname, location.pathname);
            }
        }
    }

    // Handle clicking of links on the page.
    $("body").on("click", "a", function() {
        // Check if this is an outside link. If so, continue with default logic.
        if ($(this).attr("href").indexOf("https://") > -1) return true;

        if ($(this).attr("href").indexOf("#") > -1) {
            var target = this.hash;

            contentScroll(target, false);

            return false;
        }

        // If the hostname of the link doesn't match the local page skip it as well.
        if (location.hostname !== this.hostname) return true;

        // Otherwise hide the footer to begin with to avoid cluttering of the screen.
        setFooterState(false);

        // Get the path of the link that was just pressed.
        path = $(this).attr("href");

        // If the path is not  absolute then convert it..
        if (path[0] != "/") path = "/" + path;

        if (location.pathname == path) {
            // If the link that was clicked points to the link currently open reset the page to the root page.
            setNavigationPath("");
            contentLoad("/", "", false, false);

        } else {
            // If this a new link make sure the navigation menu changes accordingly.
            setNavigationPath(path);

            if (contentActive === true) {
                // If content was active fade it out before further handling.
                $(".content").fadeOut("fast", function() {
                    // Load the new path on completion of the fade out.
                    contentLoad(path, "", false, false)
                });

            } else {
                // If no content is currently present just load in the new content.
                contentLoad(path, "", false, false);
            }
        }

        // Interupt default browser handling of the link.
        return false;
    });


    // Handle clicking on the background of the page.
    $(".background").click(function() {
        // If the footer is enabled hide it.
        if (footerActive === true) {
            setFooterState(false);
        }

        // If content was active hide it and also reset the navigation menu.
        if (contentActive === true) {
            setNavigationPath("");
            contentLoad("/", "", false, false);
        }
    });

    // Key callbacks for handling of the page.
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            setFooterState(false);

            if (contentActive === true) {
                // If content is active track the escape key. If pressed. Load the root content.
                setNavigationPath("");
                contentLoad("/", "", false, false);
            }
        }
    });

    // Add an event listener for browser history tracking.
    window.addEventListener("popstate", function(e) {
        stateFull = e.state;
        stateRoot = e.state.substr(0, (e.state.indexOf("#") > -1 ? e.state.indexOf("#") : e.state.length));
        stateMain = stateRoot.substring(stateRoot.lastIndexOf("/"))
        stateHash = e.state.indexOf("#") > -1 ? e.state.substr(e.state.indexOf("#")) : "";

        currentPathFull = currentPath;
        currentPathRoot = currentPath.substr(0, (currentPath.indexOf("#") > -1 ? currentPath.indexOf("#") : currentPath.length));
        currentPathMain = currentPathRoot.substring(currentPathRoot.lastIndexOf("/"))
        currentPathHash = currentPath.indexOf("#") > -1 ? currentPath.substr(currentPath.indexOf("#")) : "";

        // Get the path off of the event state. If there is no path set it to root.
        if (stateFull == null || stateFull == "/") {
            setNavigationPath("");
            contentLoad("/", "", true, false)

        } else if (currentPathMain.indexOf(stateMain) > -1) {
            if (stateHash != "") {
                if (contentActive === false) {
                    setNavigationPath(location.pathname);

                    contentLoad(location.pathname, location.hash, true, false);

                } else {
                    contentScroll(stateHash, true, false);
                }

            } else {
                contentScroll("#top", true, false);

            }
        } else {
            setNavigationPath(stateFull);
            contentLoad(stateRoot, stateHash, true, false);
        }

    });

    // Variables used for the parallax effect.
    var parallaxReset = false; // True if the paralalx has been reset entirely.
    var parallaxSmoothing = 0.1; // Smoothing valued applied to parallax movement.

    var parallaxMouseX = 0; // Mouse horizontal position relative to the parallax.
    var parallaxMouseY = 0; // Mouse vertical position relative to the parallax.

    var parallaxActualX = 0; // Smoothed parallax horizontal position.
    var parallaxActualY = 0; // Smoothed parallax vertical position.

    /**
     * Parallax effect applied to all elements that have the parallax class.
     */
    function parallax() {
        if (effectsActive === true) {
            // If the effect is active we set the parallax reset to false.
            parallaxReset = false;

            // Get the HTML node.
            var $html = $(document);

            // Get width and height of the current page.
            var width = $html.width();
            var height = $html.height();

            if (contentActive === false) {
                // Apply the parallax if the content is disabled. Calculate positions off of mosue positions.
                parallaxActualX = parallaxActualX + (((0.5 - (parallaxMouseY / height)) * 15) - parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + ((-(0.5 - (parallaxMouseX / width)) * 20) - parallaxActualY) * parallaxSmoothing;

                // Set the parallax CSS on the specified class elements.
                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                    "-webkit-transform-style": "flat"
                });

            } else {
                // If content is currently being shown we want to ease the parallax to its initial state.
                parallaxActualX = parallaxActualX + (-parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + (-parallaxActualY) * parallaxSmoothing;

                // Set the initial parallax CSS.
                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                    "-webkit-transform-style": "flat"
                });
            }

        } else {
            // If effects have been disabled we want to ease the parallax before disabling it.
            if (parallaxReset === false) {
                // Get the HTML node.
                var $html = $(document);

                // Get width and height of the current page.
                var width = $html.width();
                var height = $html.height();

                // Ease the parallax to a zero position effectively resetting it.
                parallaxActualX = parallaxActualX + (-parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + (-parallaxActualY) * parallaxSmoothing;

                // Set this parallax CSS on the specified class elements.
                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                    "-webkit-transform-style": "flat"
                });

                // Track if the parallax is almost zero and unnoticeable. If so, disable it.
                if (Math.abs(parallaxActualX) + Math.abs(parallaxActualY) < 0.1) parallaxReset = true;

            } else {
                // If parallax is disabled we reset the CSS for all parallax elements.
                $(".parallax").css({
                    "transform": "",
                    "transform-style": ""
                });
            }
        }
    }

    // Handle the mouse movement and set parallax variables with it.
    $(document).on("mousemove", function(e) {
        if (contentActive === false && effectsActive === true) {
            parallaxMouseX = e.pageX;
            parallaxMouseY = e.pageY;
        }
    });

    // PSA requset end point variable.
    var psaGET = "/data/psa";

    // PSA request and handling function.
    function psa() {
        if (contentActive === false) {
            // Make a request to the PSA end point.
            $.getJSON(psaGET + "?cache=" + (Math.random() * 1000000), function(data) {
                // Fade out the previous PSA.
                $("#psa").fadeOut(function() {
                    // On completion set the PSA text to the new one, set author hover value and fade in.
                    $(this).text(
                        "\"" + data.content + "\""

                    ).attr(
                        "title", "PSA by " + data.author

                    ).fadeIn();
                });
            });
        }
    }

    // Handle the page after it is completely loaded.
    $(document).ready(function() {
        // Fade in the footer anchor and control buttons as they are  hidden by default.
        $(".footer-anchor").fadeIn().css("display", "inline-block");
        $(".controls").fadeIn();

        // Set the effects enabled value from the cookie value.
        var fxEnabled = getCookie("fx-enabled") === "true";
        scenePaused = !fxEnabled;
        setEffectsState(fxEnabled);

        // Load content from the current path. This is done to fade in and prepare logic.
        contentLoad(location.pathname, window.location.hash.substr(1), false, true);

        // Set the right animation intervals for the parallax and PSA handling.
        setInterval(parallax, 1000 / 60);
        setInterval(psa, 15000);

        // Call the PSA function and get the PSA after page load.
        psa();
    });
});
