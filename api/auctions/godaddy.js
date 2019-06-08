const puppeteer = require('puppeteer')
var Joi = require('@hapi/joi')

// Options can be passed to plugins on registration
exports.plugin = {
  name: 'auctions/godaddy', // Must be unique
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/auctions/godaddy',
      config: {
        tags: ['api', 'auction', 'godaddy'],
        description: 'GoDaddy bidder',
        notes: 'Bid on a godaddy.com expired domain',
        validate: {
          payload: {
            username: Joi.string().required().default('96217004'),
            password: Joi.string().required().default('GhcrQ87jgfeQiVCt4gVD7ugMB78jV2FV5fvo'),
            domain: Joi.string().required().default('sharenow-com-288171942'),
            bid: Joi.string().required().min(2).default('20')
          }
        }
      },
      handler: function (req, h) {
        return ((async () => {
          const browser = await puppeteer.launch()
          const page = await browser.newPage()
          const retry = (fn) => fn().catch(retry.bind(fn))

          // await page.goto('https://sso.godaddy.com/?realm=idp&app=auctions&path=/');
          await retry(() => page.goto('https://sso.godaddy.com/?realm=idp&app=auctions&path=/'))
          await page.waitForSelector('#username')
          await page.type('#username', req.payload.username)
          await page.type('#password', req.payload.password)
          await page.click('#submitBtn')
          await page.waitForSelector('#tdAuctionLogoAuctions')

          // await page.goto('https://www.godaddy.com/domain-auctions/' + req.payload.domain);
          await retry(() => page.goto('https://godaddy.com/domain-auctions/' + req.payload.domain))
          await page.waitForSelector('#bidAmount')

          // Read the current price before continuing
          let price = await page.$eval('#bidAmount', el => el.value)
          price = Number(price.replace(/,/g, ''))

          if (price <= req.payload.bid) {
            console.log('Price at ' + price)

            // Make sure we don't append a price!
            const bidPrice = await page.$('#bidAmount')
            await bidPrice.click({ clickCount: 3 })

            await bidPrice.type(req.payload.bid)
            await page.click('#place_bid')

            // Wait for confirmation popup
            await page.waitForSelector('#confirm_bid')

            // await page.screenshot({ path: req.payload.domain + '_bid-ready.png' })

            await page.click('#confirm_bid')

            await page.waitFor(4000)

            console.log('Successful bid at ' + req.payload.bid)

            // await page.screenshot({ path: req.payload.domain + '_bid-complete.png' })

            await browser.close()

            return {
              statusCode: 200,
              statusText: 'Success',
              message: 'Successful bid at ' + req.payload.bid
            }
          } else {
            console.log('The price is already at ' + price)
            // await page.screenshot({ path: req.payload.domain + '_bid-aborted.png' })
            await browser.close()
            return {
              statusCode: 200,
              statusText: 'Error',
              message: 'The price is already at ' + price
            }
          }
        })())
      }
    })
  }
}
