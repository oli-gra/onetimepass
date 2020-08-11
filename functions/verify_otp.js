const admin = require('firebase-admin')

module.exports = (req,res) => {
    if (!req.body.phone || !req.body.code) res.status(422).send({error: 'Phone and code needed!'})

    const phone = String(req.body.phone).replace(/[^\d]/g,'')
    const code = parseInt(req.body.code)
    const ref = admin.database().ref("users/" + phone)    
    
    const error = err => res.status(422).send({error:err.message})
   
    const sendToken = () => admin.auth().createCustomToken(phone)
        .then(token => {
            ref.update({used:true})
            return res.status(200).send({token})
        })
        .catch(err=>error(err))
  
    const checkCode = () => {
        ref.once("value")
        .then(data=>{
            const user = data.val()      
            return user.code !== code || user.used 
                ? res.status(422).send({error: 'Code invalid'})
                : sendToken()
        })
        .catch(err=>error(err))
    }


    admin.auth().getUser(phone)
        .then(()=>checkCode())
        .catch(err=> error(err))    
}