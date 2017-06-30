$(function() {
    var frameRate = 15;

    var startTimer = 0;
    var startDelay = frameRate * 2;

    var buildTimer = 0;
    var buildDelay = 10 * frameRate;

    var build = true;
    var buildstring = "";
    var buildgoal = ""
    var buildoutput = "";

    var id = -1;
    var lastid = -1;

    var motds = [
        "I made a game once.",
        "Your humble fishstick and fiendlord.",
        "Professional button presser.",
        "I'm alright at video games.",
        "Javascript is disabled. Right?"
    ];

    function motd() {
        if (startTimer < startDelay) {
            startTimer++;
            return;
        }

        $("#motd").text("\"" + buildoutput + "\"");

        if (build == false) {
            if (buildTimer < buildDelay) {
                buildTimer++;

            } else {
                buildoutput = buildoutput.substr(0, buildoutput.length - 1);

                if (buildoutput.length == 0) {
                    buildTimer = 0;
                    build = true;
                    buildstring = "";
                }
            }


        } else {
            if (buildstring == "") {
                while (id == lastid) {
                    id = Math.floor(Math.random() * motds.length);
                }

                lastid = id;

                buildgoal = motds[id];
                buildstring = buildgoal;
            }

            buildoutput = buildoutput + buildstring.substr(0, 1);

            buildstring = buildstring.substr(1, buildstring.length);

            if (buildoutput === buildgoal) build = false;
        }
    }

    setInterval(motd, 1000 / frameRate);
});
