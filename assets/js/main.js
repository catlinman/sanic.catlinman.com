String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(function() {
    var footerActive = false;
    var contentActive = false;

    function footerEnable(state) {
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
        footerEnable(!footerActive);
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

            var filterVal = "blur(4px)"

            /*$(".background-blur").css("filter", filterVal)
                .css("webkitFilter", filterVal)
                .css("mozFilter", filterVal)
                .css("oFilter", filterVal)
                .css("msFilter", filterVal);*/

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

            psa();
            $(".content, .content-cover").fadeOut();
        }
    }

    $("a").click(function() {
        if (location.hostname === this.hostname) {
            footerEnable(false);

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

    var parallaxSmoothing = 0.1;

    var parallaxMouseX = 0;
    var parallaxMouseY = 0;

    var parallaxActualX = 0;
    var parallaxActualY = 0;

    function parallax() {
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
    }

    $(document).on("mousemove", function(e) {
        if (contentActive === false) {
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

        contentLoad(location.pathname, false);

        setInterval(parallax, 1);
        setInterval(psa, 15000);

        psa();
    });
});
