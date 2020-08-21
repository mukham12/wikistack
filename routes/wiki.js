const router = require('express').Router()
const { Page, User } = require('../models')
const { addPage, wikiPage, main } = require('../views')

router.get('/', async (req, res, next) => {
    try {
        res.send(main(await Page.findAll()))
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const [user, wasCreated] = await User.findOrCreate({
            where: {
                name: req.body.name,
                email: req.body.email
            }
        })
        const page = await Page.create(req.body)
        page.setAuthor(user)
        res.redirect(`/wiki/${page.slug}`)
    } catch (error) {
        next(error)
    }
})

router.get('/search', async (req, res, next) => {
    try {
        res.send(main(await Page.findByTag(req.query.search)))
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

        await page.update({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status,
            tags: req.body.tags,
        })

        const author = await page.getAuthor()
        res.send(wikiPage(page, author))
    } catch (error) {
        next(error)
    }
})

module.exports = router