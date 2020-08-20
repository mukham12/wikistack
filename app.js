const express = require('express')
const morgan = require('morgan')
const { db } = require('./models')
const path = require('path')

const app = express()

db.authenticate().then(() => console.log('connected to the database'))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/wiki', require('./routes/wiki'))
app.use('/user', require('./routes/user'))

app.get('/', (req, res) => {
    res.redirect('/wiki')
})

const init = async () => {
    await db.sync()
    app.listen(3000, () => console.log(`Listening on port ${3000}`))
}

init()
