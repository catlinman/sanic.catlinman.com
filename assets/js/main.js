String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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

            scenePaused = false;
            $("canvas").fadeIn();
        }

        setCookie("fx-enabled", state, 2147483647);
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

    function navHighlight(path) {
        var pathroot = path.split("/")[0];

        $("nav a").each(function() {
            var linksplit = this.href.split("/")
            var linkroot = linksplit[linksplit.length - 1];

            if (linkroot.toLowerCase() == pathroot) {
                $(this).css("border-top", "4px solid #fece7e");

            } else {
                $(this).css("border-top", "");
            }
        });
    }

    function contentLoad(path, replace, standalone) {
        if (replace === true) {
            history.replaceState(path, path, path);

        } else {
            history.pushState(path, path, path);
        }

        path = path.slice(1);

        if (path != "") {
            navHighlight(path);

            contentActive = true;

            if (effectsActive === true) {
                var filterVal = "blur(4px)"

                $(".background-blur").css("filter", filterVal)
                    .css("webkitFilter", filterVal)
                    .css("mozFilter", filterVal)
                    .css("oFilter", filterVal)
                    .css("msFilter", filterVal);
            }

            // If page content is already we skip further loading.
            if (standalone === true) {
                $("#psa").fadeOut()
                $(".content, .content-cover").fadeIn().css("display", "inline-block");

                return;
            };

            var progress = 50;
            var progressSmoothed = 0;

            $("progress").fadeIn(0.5, function() {
                var p = $(this);

                var loop = setInterval(function() {
                    if (progressSmoothed < 99.75) {
                        progressSmoothed = progressSmoothed + (progress - progressSmoothed) * 0.05;

                        if (p.hasClass("progress-reverse")) {
                            p.val(100 - progressSmoothed);

                        } else {
                            p.val(progressSmoothed);
                        }

                    } else {
                        var reset = 0;

                        if (p.hasClass("progress-reverse")) {
                            reset = 100;
                        }

                        p.fadeOut(function() {
                            p.val(reset);
                        });

                        clearInterval(loop);
                    }
                }, 1000 / 60);
            });

            $.get(path + "/html", function(data) {
                progress = 100;

                /*
                    Failsafe check if an entire page was served.

                    This is required for cases where error pages and other content
                    with no separate path for HTML is served. The tags need to be
                    specified in the template files for this to work. Otherwise
                    page recursion might occur.
                */
                if (data.indexOf("content-standalone") > -1) {
                    var titleLength = "<div content-title=\"".length;
                    var titleStart = data.indexOf("<div content-title=\"");
                    var titleEnd = data.indexOf("\" class=\"content-standalone-title\"></div>");

                    var title = data.slice(titleStart + titleLength, titleEnd);

                    if (title != "") document.title = "Catlinman" + " - " + title;

                    var contentStart = data.indexOf("<div class=\"content-standalone-start");
                    var contentEnd = data.indexOf("<div class=\"content-standalone-end\"></div>");

                    var data = data.slice(contentStart, contentEnd);

                } else {
                    document.title = "Catlinman" + " - " + path.capitalize();
                }

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
        if ($(this).attr("href").indexOf("https://") > -1) return true;

        if (location.hostname !== this.hostname) return true;

        footerState(false);

        path = $(this).attr("href");

        if (path[0] != "/") path = "/" + path;

        if (location.pathname == path) {
            navHighlight("");
            contentLoad("/", false, false);

        } else {
            navHighlight(path);

            if (contentActive === true) {
                $(".content-cover").fadeOut("fast");

                $(".content").fadeOut("fast", function() {
                    contentLoad(path, false, false)
                });

            } else {
                contentLoad(path, false, false);
            }
        }

        return false;
    });

    $(".background").click(function() {
        if (footerActive === true) {
            footerState(false);
        }

        if (contentActive === true) {
            navHighlight("");
            contentLoad("/", false, false);
        }
    });

    $(document).keyup(function(e) {
        if (contentActive === true) {
            if (e.keyCode == 27) {
                contentLoad("/", false, false);
            }
        }
    });

    window.addEventListener("popstate", function(e) {
        var path = "";

        if (e.state == null) path = "/";
        else path = e.state;

        if (contentActive === true) {
            $(".content-cover").fadeOut("fast");

            $(".content").fadeOut("fast", function() {
                contentLoad(path, true, false)
            });

        } else {
            contentLoad(path, true, false);
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
                    "-webkit-transform-style": "flat"
                });

            } else {
                parallaxActualX = parallaxActualX + (-parallaxActualX) * parallaxSmoothing;
                parallaxActualY = parallaxActualY + (-parallaxActualY) * parallaxSmoothing;

                $(".parallax").css({
                    "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + parallaxActualX + "deg) rotateY(" + parallaxActualY + "deg)",
                    "-webkit-transform-style": "flat"
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
                    "-webkit-transform-style": "flat"
                });

                if (Math.abs(parallaxActualX) + Math.abs(parallaxActualY) < 0.1) parallaxReset = true;

            } else {
                $(".parallax").css({
                    "transform": "",
                    "transform-style": ""
                });
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
            $.getJSON("psa" + "?cache=" + (Math.random() * 1000000), function(data) {
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

        var fxEnabled = getCookie("fx-enabled") === "true";
        scenePaused = !fxEnabled;
        effectsState(fxEnabled);

        contentLoad(location.pathname, false, true);

        setInterval(parallax, 1000 / 60);
        setInterval(psa, 15000);

        psa();
    });
});
