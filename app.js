const express = require('express')
const { db } = require('./models')

const app = express()

db.authenticate().then(() => console.log('connected to the database'))

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use('/wiki', require('./routes/wiki'))
app.use('/users', require('./routes/user'))

app.get('/', (req, res) => res.redirect('/wiki'))

const init = async () => {
    await db.sync()
    app.listen(3000, () => console.log(`Listening on port ${3000}`))
}

init()
