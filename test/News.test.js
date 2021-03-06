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
        let result, newsCount, bookMarksCount
        const imgHash = 'abc123'
        const newsHash = 'xyz123'
        before(async () => {
            result = await news.addNews(newsHash, imgHash, { from: author })
            newsCount = await news.newsCount()
        })

        it('News added', async () => {
            assert.equal(newsCount, 1)
            const event = await result.logs[0].args
            assert.equal(event.id.toNumber(), newsCount.toNumber(), 'the id is not correct')
            assert.equal(event.hashOfNews, newsHash, 'the title is not correct')
            assert.equal(event.hashOfImage, imgHash, 'The hash is not correct')
            assert.equal(event.author, author, 'the address of author is not correct')
        })

        it("Show news", async () => {
            const article = await news.news(newsCount)
            assert.equal(article.id.toNumber(), newsCount.toNumber(), "The id is not correct!")
            assert.equal(article.hashOfNews, newsHash, "The title is not correct!")
            assert.equal(article.hashOfImage, imgHash, "The hash is not correct!")
            assert.equal(article.author, author, "The author address is not correct!")
        })

        it("favListUpdated", async () => {
            result = await news.addBookMarks(newsCount, {from: author})
            const bookMarks = await news.getBookMarks({from: author})
            bookMarksCount = bookMarks.length;
            const id = bookMarks[0]
            const article = await news.news(id)
            assert.equal(bookMarksCount, 1)
            assert.equal(article.id.toNumber(), newsCount.toNumber(), "The id is not correct!")
            assert.equal(article.hashOfNews, newsHash, "The title is not correct!")
            assert.equal(article.hashOfImage, imgHash, "The hash is not correct!")
            assert.equal(article.author, author, "The author address is not correct!")
        })
    })
})

