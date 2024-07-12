const { createClient } = require('@supabase/supabase-js');
const { getYearAndMonth } = require('./getYearAndMonth');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

async function GetAllData() {
    let { data, error } = await supabase.from('Data').select('*');
    console.log(data);
}

async function addNewEmoji(emoji, name) {
    const { data, error } = await supabase.from('Data').insert([{ emoji: emoji, name: name }]).select();
    if (data) {
        return { data: data, error: null };
    } else {
        if (error.details.includes("already exists")) {
            return { data: null, error: `${emoji} already exists` };
        } else {
            return { data: null, error: error.details };
        }
    }
}

async function voteEmoji(number, emoji) {
    const currentDate = new Date();
    const getCurrentDate = currentDate.toISOString();
    const { data, error } = await supabase
        .from('Data')
        .select('voters, name')
        .eq('emoji', emoji);

    if (data) {
        const previousVoters = data[0]?.voters;
        const name = data[0]?.name;
        if (name) {
            let count = 0;
            for (const voter in previousVoters) {
                count += previousVoters[voter].length;
            }
            if (previousVoters && previousVoters[number]) {
                const updatedVoters = { ...previousVoters, [number]: [...previousVoters[number], getCurrentDate] };
                const { data, error } = await supabase
                    .from('Data')
                    .update({ voters: updatedVoters })
                    .eq('emoji', emoji)
                    .select();
                if (data) {
                    count++;
                    let text = `*${emoji}${name}${emoji}* just scored! They now have ${count} GB's\n`;
                    text += `\n*1 GBs*               *${emoji}${name}${emoji}*`;

                    const scoreboard = await GetAllTimeLeaderBoard();
                    const leaderboard = scoreboard?.data;
                    text += leaderboard;

                    return { data: text, error: null };
                } else {
                    return { data: null, error: error };
                }
            } else {
                const updatedVoters = { [number]: [getCurrentDate] };
                const { data, error } = await supabase
                    .from('Data')
                    .update({ voters: updatedVoters })
                    .eq('emoji', emoji)
                    .select();
                if (data) {
                    count++;
                    let text = `*${emoji}${name}${emoji}* just scored! They now have ${count} GB's\n`;
                    text += `\n*1 GBs*               *${emoji}${name}${emoji}*`;

                    const scoreboard = await GetAllTimeLeaderBoard();
                    const leaderboard = scoreboard?.data;
                    text += leaderboard;
                    return { data: text, error: null };
                } else {
                    return { data: null, error: error };
                }
            }
        } else {
            return { data: `${emoji} not found` };
        }
    } else {
        return { data: null, error: error };
    }
}

async function deVoteEmoji(number, emoji) {
    const { data, error } = await supabase
        .from('Data')
        .select('voters, name')
        .eq('emoji', emoji);

    if (data) {
        const voters = data[0]?.voters;
        const name = data[0]?.name;
        if (name) {
            let count = 0;
            for (const voter in voters) {
                count += voters[voter].length;
            }
            if (voters && voters[number] && voters[number].length) {
                const votes = JSON.parse(JSON.stringify(voters[number]));
                votes.pop();
                const UpdatedVoters = { ...voters, [number]: votes };
                const { data, error } = await supabase
                    .from('Data')
                    .update({ voters: UpdatedVoters })
                    .eq('emoji', emoji)
                    .select();
                if (data) {
                    count--;
                    const text = `*${emoji}${name}${emoji}* just lost! They now have ${count} GB's`;
                    return { data: text, error: null };
                } else {
                    return { data: null, error: error };
                }
            } else {
                const text = `You have not Voted Yet`;
                return { data: text, error: null };
            }
        } else {
            return { data: `${emoji} not found` };
        }
    } else {
        return { data: null, error: error };
    }
}

async function getEmojiCountPerMonthAndYear(Month, Year, emoji) {
    const { data, error } = await supabase
        .from('Data')
        .select('voters')
        .eq('emoji', emoji);

    if (data) {
        const previousVoters = data[0].voters;
        let count = 0;
        for (const voter in previousVoters) {
            for (const index in previousVoters[voter]) {
                const date = previousVoters[voter][index];
                const { year, month } = getYearAndMonth(date);
                if (year.toLowerCase() === Year.toLowerCase() && Month.toLowerCase().startsWith(month.toLowerCase())) {
                    count++;
                }
            }
        }
        return count;
    } else {
        return null;
    }
}

async function GetAllTimeLeaderBoard() {
    const { data, error } = await supabase
        .from('Data')
        .select('voters, name, emoji');
    if (data) {
        const arr = [];
        let total = 0;
        for (const item of data) {
            let count = 0;
            for (const voter in item.voters) {
                count += item.voters[voter].length;
            }
            total += count;
            arr.push({ count: count, rep: `${item.emoji}${item.name}${item.emoji}` });
        }
        let text = `\n---------------------------------------------\n`;
        text += `\n*EverRise Scoreboard*\n`;
        text += `All time - *${total}GBs*\n`;
        text += `\n---------------------------------------------\n`;
        arr.sort((a, b) => {
            if (b.count > a.count) return 1;
            else if (b.count < a.count) return -1;
            else return 0;
        });
        let tempLeaderBoard = "";
        for (let obj in arr) {
            tempLeaderBoard += `\n*${arr[obj].count} GBs*      ${arr[obj].rep}`;
        }
        text += tempLeaderBoard;
        return { data: text, error: null };
    } else {
        return { data: null, error: error };
    }
}

async function getTimelyLeaderBoard(month, year) {
    const { data, error } = await supabase
        .from('Data')
        .select('voters, name, emoji');
    if (data) {
        let total = 0;
        let leaderBoardData = "";
        for (const item of data) {
            const count = await getEmojiCountPerMonthAndYear(month, year, item.emoji);
            if (count) {
                total = total + count;
                leaderBoardData += `\n*${count} GBs*      ${item.emoji}${item.name}${item.emoji}`;
            }
        }
        let text = `\n---------------------------------------------\n`;
        text += `\n*EverRise Scoreboard*\n`;
        text += `${month} ${year} - *${total}GBs*\n`;
        text += `\n---------------------------------------------\n`;
        text += leaderBoardData;
        return { data: text, error: null };
    } else {
        return { data: null, error: error };
    }
}

module.exports = {
    GetAllData,
    addNewEmoji,
    voteEmoji,
    deVoteEmoji,
    getEmojiCountPerMonthAndYear,
    GetAllTimeLeaderBoard,
    getTimelyLeaderBoard
};
