const admin = require('firebase-admin')
const twilio = require('./twilio')

module.exports = (req,res) => {
    if (!req.body.phone) {
        return res.status(422).send({error:'Phone number required'})
    }
    
    const phone = String(req.body.phone).replace(/[^\d]/g,'')
    
    return admin.auth().getUser(phone)
        .then(() => {
            const code = Math.floor(Math.random() * 899999 + 1000)
            return twilio.messages.create({
                to: phone.replace('0','+44'),
                from: '+14157671632',
                body: `Your code is ${code}`
            }, err => {
                if (err) res.status(422).send({error: err.message})

                return admin.database().ref('users/' + phone)
                    .update({code, used: false}, ()=> {
                        res.status(200).send({success: true})
                    })
            })

        })
        .catch(err => res.status(422).send({error: err.message}))
} 