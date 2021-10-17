const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

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
    const employees = [
        {id:'0a', email: 'a@cymulate.com'},
        {id:'1b', email: 'b@cymulate.com'},
        {id:'2c', email: 'c@cymulate.com'},
        {id:'3d', email: 'd@cymulate.com'},
    ]
    if (id){
        const employee = employees.filter(employee => employee.id === id)
        // sendEmail(employee.email)
    }
    res.send('ok').status(200)
})

app.get('/text/*', (req, res, next) => {
    console.log(req.originalUrl, ' clicked!!!')
    console.log(req.params[0], 'Clicked!!!')
    res.send('hello').status(200)
})



app.get('/', (req, res) => {
    console.log('called')
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
