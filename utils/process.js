function processText(text) {
    // add emoji in database #emoji name emoji
    // help #help
    // scoreboard #scoreboard
    // timely scoreboard #change month year
    // vote #emoji
    // devote #-emoji
    console.log("text", text);
    if (text.startsWith("#help")) {
        return { type: "help" };
    }
    else if (text.startsWith("#scoreboard")) {
        return { type: "scoreboard" };
    }
    else if (text.startsWith("#change")) {
        const arr = text.split(" ");
        const month = arr[1];
        const year = arr[2];
        return { type: "timelyScoreBoard", year, month };
    }
    else if (text[0] == "#" && text[1] == '-') {
        const emoji = text.split('-')[1];
        return { type: "deVote", emoji }
    }
    else if (text.startsWith("#") && text.split(" ").length == 3) {
        const arr = text.split(" ");
        const first = arr[0].replace("#", '');
        const name = arr[1];
        const last = arr[2];
        if (first == last) {
            return { type: "add", emoji: last, name }
        } else {
            return { type: null, error: "Incorrect format" }
        }
    } else if (text.startsWith("#") && text.split("#").length == 2) {
        const emoji = text.split("#")[1];
        return { type: "vote", emoji }
    }
    else {
        return { type: null, error: "Incorrect format" };
    }

}

module.exports = {processText};