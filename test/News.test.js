const { assert } = require('chai')
const News = artifacts.require('./News.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract("News", ([deployer, author, reader]) => {
    let news

    before(async () => {
        news = await News.deployed()
    })

    describe('deployment', async () => {

        it('deployed successfully', async () => {
            const Address = news.address
            assert.notEqual(Address, '0x0')
            assert.notEqual(Address, '')
            assert.notEqual(Address, null)
            assert.notEqual(Address, undefined)
        })

        it('Contract has a name', async () => {
            const name = await news.name()
            assert.equal(name, 'News Contract')
        })
    })

    describe('News', async () => {
        let result, newsCount, favCount
        const imgHash = 'abc123'
        before(async () => {
            result = await news.addNews("title", 'abc123', "description", "category", { from: author })
            newsCount = await news.newsCount()
        })

        it('News added', async () => {
            assert.equal(newsCount, 1)
            const event = await result.logs[0].args
            assert.equal(event.id.toNumber(), newsCount.toNumber(), 'the id is not correct')
            assert.equal(event.title, 'title', 'the title is not correct')
            assert.equal(event.hashOfImage, imgHash, 'The hash is not correct')
            assert.equal(event.description, 'description', 'the description is not correct')
            assert.equal(event.category, 'category', 'the category is not correct')
            assert.equal(event.author, author, 'the address of author is not correct')
        })

        it("show news", async () => {
            const article = await news.news(newsCount)
            assert.equal(article.id.toNumber(), newsCount.toNumber(), "The id is not correct!")
            assert.equal(article.title, "title", "The title is not correct!")
            assert.equal(article.hashOfImage, imgHash, "The hash is not correct!")
            assert.equal(article.description, "description", "The description is not correct!")
            assert.equal(article.category, "category", "The category is not correct!")
            assert.equal(article.author, author, "The author address is not correct!")
        })

        it("favNewsAdded", async () => {
            result = await news.addFav(newsCount.toNumber(), {from: author})

            const event = await result.logs[0].args
            assert.equal(event.id.toNumber(), newsCount.toNumber(), 'the id is not correct')
            assert.equal(event.title, 'title', 'the title is not correct')
            assert.equal(event.hashOfImage, imgHash, 'The hash is not correct')
            assert.equal(event.description, 'description', 'the description is not correct')
            assert.equal(event.category, 'category', 'the category is not correct')
            assert.equal(event.author, author, 'the address of author is not correct')
        })
    })
})