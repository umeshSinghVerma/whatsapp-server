
async function SendResponseToWhatsapp(message) {
    if(message){
        console.log("message ",message);
        console.log("token",process.env.ULTRAMSG_TOKEN)
        console.log("to",process.env.GROUP_ID)
        console.log("instance",process.env.INSTANCE)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
        var urlencoded = new URLSearchParams();
        urlencoded.append("token", process.env.ULTRAMSG_TOKEN);
        urlencoded.append("to", process.env.GROUP_ID);
        urlencoded.append("body", message);
    
    
        fetch(`https://api.ultramsg.com/${process.env.INSTANCE}/messages/chat`, {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        })
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
}

module.exports = {SendResponseToWhatsapp};