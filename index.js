const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const nodemailer = require("nodemailer")

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


const emailSent = []
const linksClicked = []
const employees = [
    {id:'0a', email: 'a@cymulate.com'},
    {id:'1b', email: 'b@cymulate.com'},
    {id:'2c', email: 'c@cymulate.com'},
    {id:'3d', email: 'd@cymulate.com'},
]

app.post('/authenticate', (req, res, next) => {
    const user = {
        email: 'admin@cymulate.com',
        password: 'admin password'
    }
    if (req.body.email === user.email && req.body.password=== user.password){
        console.log('user logged in')
        res.send(JSON.stringify('valid user')).status(200)
    }else {
        res.send('not valid').status(403)
    }

})

app.post('/send-email', (req, res, next) => {


    const id = req.body['userId']

    if (id){
        const employee = employees.filter(employee => employee.id === id)[0]
        if (employee){
            sendEmail(employee.id,employee.email ).catch(console.error);
        }
    }
    async function sendEmail(userId, userEmail) {
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // send mail with defined transport object
        const link = `<a href=localhost:3000/text/${userId}>A safe link</a>`

            let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "buzzfoo@example.com",
            subject: "Hello test email",
            text: "Hello world?",
            html: "" +
                "<p>Please click</p>" +
                link+
                "<p>Have a great day!</p>",
        });

        console.log("Message sent: %s", info.messageId);
        // should be logged in the db
        emailSent.push({employeeId: userId, email:  userEmail, date: Date.now(), msgId: info.messageId})

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.send('ok').status(200)
})

app.get('/test/*', (req, res, next) => {
    linksClicked.push({userId: req.originalUrl.split('/')[2]})
    res.send('hello logged').status(200)
})

app.get('/list',(req, res, next) => {
    // should do some join of the data to display status
    res.send(JSON.stringify({statusList: linksClicked})).status(200)
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
