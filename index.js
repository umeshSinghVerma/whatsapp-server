const express = require('express')
const dotenv = require('dotenv')
dotenv.config();
const bodyParser = require('body-parser')
const { GetAllTimeLeaderBoard } = require('./utils/supabase');
const { handleIncomingMessage } = require('./utils/handleIncomingText');
const app = express()
const PORT = 8080
// Setup a webhook route
app.use(bodyParser.json())
app.post('/ultramsgwebhook', async(req, res) => {
    const body = req.body // print all response

    //messageFrom=req.body['data']['from'] // sender number
    //messageMsg=req.body['data']['body'] // Message text
    const data = body?.data;
    const sender = data.author;
    const groupId = data.from;
    const message = data.body;
    if (groupId == process.env.GROUP_ID) {
        await handleIncomingMessage(sender, message);
    }

    res.status(200).end()
})
app.get('/scoreboard', async (req, res) => {
    const text = await handleIncomingMessage("dhfasdfa","#scoreboard");
    console.log(text);
    res.send(text?.data);
})

app.use(bodyParser.json())
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}🚀 `))