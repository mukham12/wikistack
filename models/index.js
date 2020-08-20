const Sequelize = require('sequelize')

const db = new Sequelize('postgres://postgres@localhost:5432/wikistack', { logging: false })

const Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
    },
})

Page.beforeValidate((page) => page.slug = page.title.replace(/\s+/g, '_').replace(/\W/g, ''))

Page.beforeCreate((page) => page.tags = page.tags.split(' '))

Page.findByTag = tag => {
    return Page.findAll({
        where: {
            tags: {
                [Sequelize.Op.overlap]: [tag],
            },
        },
    })
}

const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
})

Page.belongsTo(User, { as: 'author' })
User.hasMany(Page, { foreignKey: 'authorId' })

module.exports = { db, Page, User }