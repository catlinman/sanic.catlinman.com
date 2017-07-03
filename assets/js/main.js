$(function() {
    t = 0.1;

    mx = 0;
    my = 0;

    ax = 0;
    ay = 0;

    contentMode = false;

    function setMode(mode) {
        contentMode = mode;

        if (contentMode === true) {
            var filterVal = "blur(4px)"

            $(".background-blur").css("filter", filterVal)
                .css("webkitFilter", filterVal)
                .css("mozFilter", filterVal)
                .css("oFilter", filterVal)
                .css("msFilter", filterVal);


            $("#psa").fadeOut()
            $(".content, .content-cover").css("display", "inline-block").fadeIn();

        } else {
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

    $("#background").click(function() {
        if (contentMode == true) {
            history.pushState("about", "About", "/");
            setMode(false);
        }
    });

    window.addEventListener("popstate", function(e) {
        var name = e.state;

        if (name == null) {
            document.title = "Catlinman";
            setMode(false);

        } else {
            document.title = "Catlinman" + " - " + e.state.charAt(0).toUpperCase() + e.state.slice(1);
            setMode(true);
        }
    });

    $(document).on("mousemove", function(e) {
        if (contentMode === false) {
            mx = e.pageX;
            my = e.pageY;
        }
    });

    function parallax() {
        var $html = $(document);

        var width = $html.width();
        var height = $html.height();

        if (contentMode === false) {
            ax = ax + (((0.5 - (my / height)) * 15) - ax) * t;
            ay = ay + ((-(0.5 - (mx / width)) * 20) - ay) * t;

            $(".parallax").css({
                "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + ax + "deg) rotateY(" + ay + "deg)",
            });

        } else {
            ax = ax + (-ax) * t;
            ay = ay + (-ay) * t;

            $(".parallax").css({
                "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + ax + "deg) rotateY(" + ay + "deg)",
            });
        }
    }

    function psa() {
        if (contentMode === false) {
            $.getJSON("psa", function(data) {
                $("#psa").fadeOut(function() {
                    $(this).text(
                        "\"" + data.content + "\""

                    ).attr(
                        "title", "This PSA is by " + data.author

                    ).fadeIn();
                });
            });
        }
    }

    $(document).ready(function() {
        var partial = document.title.split(" - ")[1];

        if (partial) {
            history.pushState(partial.toLowerCase(), partial, window.location.pathname);

        } else {
            history.pushState("root", "Root", "");
        }


        if (location.pathname != "/") {
            setMode(true);
        }

        setInterval(parallax, 1);
        setInterval(psa, 15000);

        psa();
    });
});
