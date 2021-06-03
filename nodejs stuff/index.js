const admin = require('firebase-admin')
const express = require('express')
const app = express()

var serviceAccount = require("./scms-6cbb9-firebase-adminsdk-va6s4-a74d5343f7.json");
app.use(express.json())
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.post('http://193b49cb2118.ngrok.io/send-noti',(req,res)=>{

    console.log(req.body)
const message = {
    notification:{
        title:"new ad",
        body:"new ad posted click to open"
    },
    tokens:req.body.tokens
}
admin.messaging().sendMulticast(message).then(res=>{
    console.log('send success')
}).catch(err=>{
    console.log(err)
})
})

app.listen(3000,()=>{
    console.log('server running')
})