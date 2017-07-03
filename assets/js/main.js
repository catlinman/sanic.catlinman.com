String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var createCookie = function(name, value, days) {
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

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

$(function() {
    var footerActive = false;
    var contentActive = false;
    var effectsActive = true;

    function effectsState(state) {
        if (state === false) {
            $(".control-fx").css("color", "#444");

            $(".dim").fadeIn();
            $(".vignette").fadeOut();

            $("canvas").fadeOut(function() {
                scenePaused = true;
            })

            var filterVal = "blur(0px)"

            $(".background-blur").css("filter", filterVal)
                .css("webkitFilter", filterVal)
                .css("mozFilter", filterVal)
                .css("oFilter", filterVal)
                .css("msFilter", filterVal);

        } else {
            $(".control-fx").css("color", "");

            $(".dim").fadeOut();
            $(".vignette").fadeIn();

            scenePaused = false;
            $("canvas").fadeIn();
        }

        createCookie("fx-enabled", state, 30);
        effectsActive = state;
    }

    $(".control-fx").click(function() {
        effectsState(!effectsActive);
    });

    function footerState(state) {
        footerActive = state;

        if (footerActive === true) {
            $(".footer-content").slideDown();
            $(".footer-anchor").css("transform", "scaleY(-1) translate(0px, 10px)");

        } else {
            $(".footer-content").slideUp();
            $(".footer-anchor").css("transform", "");
        }
    }

    $(".footer-handle").click(function() {
        footerState(!footerActive);
    });

    function contentLoad(path, replace) {
        if (replace === true) {
            history.replaceState(path, path, path);

        } else {
            history.pushState(path, path, path);
        }

        path = path.slice(1);

        if (path != "") {
            contentActive = true;

            document.title = "Catlinman" + " - " + path.capitalize();

            if (effectsActive === true) {
                var filterVal = "blur(4px)"

                $(".background-blur").css("filter", filterVal)
                    .css("webkitFilter", filterVal)
                    .css("mozFilter", filterVal)
                    .css("oFilter", filterVal)
                    .css("msFilter", filterVal);
            }

            $.get(path + "/html", function(data) {
                $(".content").html(data);

                $("#psa").fadeOut()
                $(".content, .content-cover").fadeIn().css("display", "inline-block");
            });

        } else {
            contentActive = false;

            document.title = "Catlinman";

            var filterVal = "blur(0px)"

            $(".background-blur").css("filter", filterVal)
                .css("webkitFilter", filterVal)
                .css("mozFilter", filterVal)
                .css("oFilter", filterVal)
                .css("msFilter", filterVal);

            $(".content, .content-cover").fadeOut();
        }
    }

    $("a").click(function() {
        if (location.hostname === this.hostname) {
            footerState(false);

            path = $(this).attr("href");

            if (path[0] != "/") path = "/" + path;

            contentLoad(path, false)

            return false;

        } else {
            return true;
        }
    });

    $("#background").click(function() {
        if (contentActive == true) {
            contentLoad("/", false);
        }
    });

    $(document).keyup(function(e) {
        if (contentActive == true) {
            if (e.keyCode == 27) {
                contentLoad("/", false);
            }
        }
    });

    window.addEventListener("popstate", function(e) {
        if (e.state == null) {
            contentLoad("/", true);

        } else {
            contentLoad(e.state, true);
        }
    });

    var parallaxReset = false;
    var parallaxSmoothing = 0.1;

    var parallaxMouseX = 0;
    var parallaxMouseY = 0;

    var parallaxActualX = 0;
    var parallaxActualY = 0;

    function parallax() {
        if (effectsActive === true) {
            parallaxReset = false;

            var $html = $(document);

            var width = $html.width();
            var height = $html.height();

            if (contentActive === false) {
                parallaxActualX = parallaxActualX + (((0.5 - (parallaxMouseY / height)) * 15) - parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + ((-(0.5 - (parallaxMouseX / width)) * 20) - parallaxActualY) * parallaxSmoothing;

                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                });

            } else {
                parallaxActualX = parallaxActualX + (-parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + (-parallaxActualY) * parallaxSmoothing;

                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                });
            }

        } else {
            if (parallaxReset === false) {
                var $html = $(document);

                var width = $html.width();
                var height = $html.height();

                parallaxActualX = parallaxActualX + (-parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + (-parallaxActualY) * parallaxSmoothing;

                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                });

                if (Math.abs(parallaxActualX) + Math.abs(parallaxActualY) < 0.1) parallaxReset = true;

            } else {
                $(".parallax").css("transform", "");
            }
        }
    }

    $(document).on("mousemove", function(e) {
        if (contentActive === false && effectsActive === true) {
            parallaxMouseX = e.pageX;
            parallaxMouseY = e.pageY;
        }
    });

    function psa() {
        if (contentActive === false) {
            $.getJSON("psa", function(data) {
                $("#psa").fadeOut(function() {
                    $(this).text(
                        "\"" + data.content + "\""

                    ).attr(
                        "title", "PSA by " + data.author

                    ).fadeIn();
                });
            });
        }
    }

    $(document).ready(function() {
        $(".footer-anchor").fadeIn().css("display", "inline-block");
        $(".controls").fadeIn();

        effectsState(getCookie("fx-enabled") === "true");
        contentLoad(location.pathname, false);

        setInterval(parallax, 1000 / 60);
        setInterval(psa, 15000);

        psa();
    });
});
