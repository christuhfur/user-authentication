const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const users = []

app.use(express.json())

app.get('/users', (req, res) =>{
    res.json(users)
})

app.post('/users', (req, res) =>{

    try {
        const hashedpass = await bcrypt.hash(req.body.password, 10)

        const user = {name: req.body.name, password: hashedpass }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) =>{
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
       return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    }catch {
        res.status(500).send()
    }
})

app.listen(3000)
