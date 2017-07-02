var PSAActive = true;
var PSAInterval = 15;

function PSAToggle() {
    PSAActive = !PSAActive;
}

$(function() {
    function PSA() {
        if (PSAActive === true) {
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

    setInterval(PSA, 1000 * PSAInterval);

    PSA();
});
