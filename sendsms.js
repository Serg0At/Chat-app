const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "6d0f55d7",
  apiSecret: "Nby79KHJugRvciHv" // if you want to manage your secret, please do so by visiting your API Settings page in your dashboard
})

const from = "Nby79KHJugRvciHv"
const to = "37495999480"
const text = 'Kyanqs'

async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

sendSMS();