const admin = require('firebase-admin')

module.exports = (req,res) => {
    if (!req.body.phone || !req.body.code) res.status(422).send({error: 'Number and code needed'})

    const phone = String(req.body.phone).replace(/[^\d]/g,'')
    const code = parseInt(req.body.code)
    const ref = admin.database().ref("users/" + phone)    
    
    const error = () => res.status(422).send({error:'Check your code or resend'})
   
    const sendToken = () => admin.auth().createCustomToken(phone)
        .then(token => {
            ref.update({used:true})
            return res.status(200).send({token})
        })
        .catch(error)
  
    const checkCode = () => {
        ref.once("value")
        .then(data=>{
            const user = data.val()      
            return user.code !== code || user.used 
                ? error()
                : sendToken()
        })
        .catch(error)
    }


    admin.auth().getUser(phone)
        .then(()=>checkCode())
        .catch(() => res.status(422).send({error:'Number not found'}))    
}