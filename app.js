const express = require('express')
const morgan = require('morgan')
const {db} = require('./models')

const app = express()

db.authenticate().then(() => {
    console.log('connected to the database')
})

app.use(morgan('dev'))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('')
})

const init = async () => {
    app.listen(3000, () => {
        console.log(`Listening on port ${3000}`)
    })
}

init()
