const router = require('express').Router()
const { Page, User } = require('../models')
const { addPage, wikiPage, main } = require('../views')

router.get('/', async (req, res, next) => {
    try {
        const pages = await Page.findAll()
        res.send(main(pages))
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const [user, wasCreated] = await User.findOrCreate({
            where: {
                name: req.body.name,
                email: req.body.email,
            },
        })
        const page = await Page.create(req.body)
        page.setAuthor(user)
        await page.save()
        res.redirect(`/wiki/${page.slug}`)
    } catch (error) {
        next(error)
    }
})

router.get('/search', async (req, res, next) => {
    try {
        console.log(req.query)
        const pages = await Page.findByTag(req.query.search)
        res.send(main(pages))
    } catch (error) {
        next(error)
    }
})

router.get('/add', (req, res, next) => {
    res.send(addPage())
})

router.get('/:slug', async (req, res, next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug,
            },
        })
        const author = await page.getAuthor()
        res.send(wikiPage(page, author))
    } catch (error) { next(error) }
})

module.exports = router