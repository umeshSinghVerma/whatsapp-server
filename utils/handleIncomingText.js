const { helpText } = require("./helpText");
const { processText } = require("./process");
const { SendResponseToWhatsapp } = require("./sendResponsetoWhatsapp");
const { GetAllTimeLeaderBoard, addNewEmoji, deVoteEmoji, getTimelyLeaderBoard, voteEmoji } = require("./supabase");

async function handleIncomingMessage(userId, messageBody) {
    const { type } = processText(messageBody);
    let response = "Some error has occurred";

    if (type === "help") {
        response = helpText;
    } else if (type === "scoreboard") {
        const res = await GetAllTimeLeaderBoard();
        if (!res.error) {
            const leaderboard = res?.data;
            response = leaderboard;
        } else {
            response = res.error.details;
        }
    } else if (type === "deVote") {
        let { emoji } = processText(messageBody);
        if (emoji) {
            const res = await deVoteEmoji(userId.toString(), emoji);
            if (!res.error) {
                const text = res?.data;
                response = text;
            } else {
                response = res.error.details;
            }
        }
    } else if (type === "vote") {
        let { emoji } = processText(messageBody);
        if (emoji) {
            const res = await voteEmoji(userId.toString(), emoji);
            if (!res.error) {
                const text = res?.data;
                response = text;
            } else {
                response = res.error.details;
            }
        }
    } else if (type === "timelyScoreBoard") {
        const { month, year } = processText(messageBody);
        const res = await getTimelyLeaderBoard(month, year);
        if (!res.error) {
            const leaderboard = res?.data;
            response = leaderboard;
        } else {
            response = res.error.details;
        }
    } else if (type === "add") {
        let { emoji, name } = processText(messageBody);
        if (emoji && name) {
            const res = await addNewEmoji(emoji, name);
            if (!res.error) {
                response = `*Okay, I registered you in the database. Use #${emoji} again to add Gb's :)*`;
            } else {
                response = res.error;
            }
        }
    } else {
        response = "";
    }

    if (userId && response) {
        // console.log("response ",response);
        await SendResponseToWhatsapp(response);
    }
}

module.exports = { handleIncomingMessage };
