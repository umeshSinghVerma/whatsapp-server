function distinguishHashtag(tag) {
    // Pattern 1: #help
    const helpRegex = /^#help$/;

    // Pattern 2: #scoreboard
    const scoreboardRegex = /^#scoreboard$/;

    // Pattern 3: #change MM YYYY
    const timelyScoreBoardRegex = /^#change (\w{3}) (\d{4})$/;

    // Pattern 4: #-emoji
    const devoteEmojiRegex = /^#-(\w+)$/;

    // Pattern 5: #emoji
    const voteEmojiRegex = /^#(\w+)$/;

    // Pattern 6: #emojinameemoji or #emoji name emoji
    const addRegex = /^#(\w+)[\s-]+(\w+)[\s-]+(\w+)$/;

    // Match patterns
    if (helpRegex.test(tag)) {
        return { type: "help" };
    } else if (scoreboardRegex.test(tag)) {
        return { type: "scoreboard" };
    } else if (timelyScoreBoardRegex.test(tag)) {
        const match = tag.match(timelyScoreBoardRegex);
        if (match) {
            const month = match[1];
            const year = match[2];
            return { type: "timelyScoreBoard", month, year };
        }
    } else if (devoteEmojiRegex.test(tag)) {
        const match = tag.match(devoteEmojiRegex);
        if (match) {
            const emoji = match[1];
            return { type: "devote", emoji };
        }
    } else if (voteEmojiRegex.test(tag)) {
        const match = tag.match(voteEmojiRegex);
        if (match) {
            const emoji = match[1];
            return { type: "vote", emoji };
        }
    } else if (addRegex.test(tag)) {
        const match = tag.match(addRegex);
        if (match) {
            const firstEmoji = match[1];
            const name = match[2];
            const lastEmoji = match[3];

            if (firstEmoji === lastEmoji) {
                return { type: "add", name, emoji: firstEmoji };
            }
        }
    }

    return { type: null };
}

module.exports = { distinguishHashtag };
