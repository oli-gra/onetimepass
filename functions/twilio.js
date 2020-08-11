const twilio = require('twilio')

const accountSid = 'AC5e3606d72d6af8ae2f2cb0b8972a13b1'
const authToken = '734ea6ec181b63458618477ebe57c73d'

module.exports = new twilio.Twilio(accountSid,authToken)