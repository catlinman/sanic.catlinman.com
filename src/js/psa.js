$(function() {
    var seconds = 15;

    var id = -1;
    var lastid = -1;

    var messages = [
        ["I made a game once.", "Catlinman"],
        ["Your humble fishstick and fiendlord.", "Catlinman"],
        ["Professional button presser.", "Catlinman"],
        ["I'm alright at video games.", "Catlinman"],
        ["Javascript is disabled. Right?", "Catlinman"],
        ["Pngyvazna in ROT13!", "Trif"],
        ["Meister of the Kugelscreibers.", "Trif"],
        ["Half my code is for calculators!", "Trif"],
        ["100% photoshoppable.", "Trif"],
        ["My hand is a printer!", "Trif"],
        ["Exception: sleep() returned null", "Trif"],
        ["500% more particles than our competitors!", "Trif"],
        ["Probably not a robot.", "Trif"],
        ["My favourite hat is a melon.", "Jan Dolanský"],
        ["I come with lots of *pats*.", "Jan Dolanský"],
        ["My name is Cat but you can call me anytime.", "Jan Dolanský"],
        ["Isn't a cat actually.", "Jan Dolanský"],
        ["I will break your game.", "Jan Dolanský"],
        ["Internet professional.", "Jan Dolanský"],
        ["Gotta go fast just like this website.", "Jan Dolanský"],
        ["This page is served as HTML. Fascinating.", "Jan Dolanský"],
        ["*tap tap tap*", "Jan Dolanský"],
        ["No HTML, CSS or JS. Only notepad. Perfect web design.", "Jan Dolanský"],
        ["I'm letting friends write these messages for me.", "Jan Dolanský"],
        ["Can basically do anything. At least that's what people say.", "Jan Dolanský"],
        ["Content aware scale ethusiast.", "Jan Dolanský"],
        ["TOP 10 'in Riding Club Championships'.", "Jan Dolanský"],
        ["Mostly safe for work.", "Catlinman"],
        ["The only truly certified sandshark!", "Mixilaxi"]
    ];

    function psa() {
        while (id == lastid) {
            id = Math.floor(Math.random() * messages.length);
        }

        lastid = id;

        $("#psa").fadeOut(function() {
            $(this).text(
                "\"" + messages[id][0] + "\""

            ).attr(
                "title", "PSA by " + messages[id][1]

            ).fadeIn();
        });
    }

    setInterval(psa, 1000 * seconds);

    psa();
});
