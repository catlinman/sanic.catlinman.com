$(function() {
    t = 0.1;

    mx = 0;
    my = 0;

    ax = 0;
    ay = 0;

    $(document).on("mousemove", function(e) {
        mx = e.pageX;
        my = e.pageY;
    });

    function parallax() {
        var $html = $(document);

        var width = $html.width();
        var height = $html.height();

        ax = ax + (((0.5 - (my / height)) * 15) - ax) * t;
        ay = ay + ((-(0.5 - (mx / width)) * 20) - ay) * t;

        $(".parallax").css({
            "transform": "perspective(" + ((width + height) / 2) + "px) rotateX(" + ax + "deg) rotateY(" + ay + "deg)",
        });
    }

    setInterval(parallax, 1);
});
