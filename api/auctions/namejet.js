const puppeteer = require('puppeteer')
var Joi = require('@hapi/joi')

// Options can be passed to plugins on registration
exports.plugin = {
  name: 'auctions/namejet', // Must be unique
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/auctions/namejet/{username}/{password}/{domain}/{bid}',
      config: {
        tags: ['api', 'auction', 'namejet'],
        description: 'Namejet bidder',
        notes: 'Bid on a namejet.com expired domain',
        validate: {
          params: {
            username: Joi.string().required().default('romainb'),
            password: Joi.string().required().default('ddsdkllk134jjoiio1'),
            domain: Joi.string().required().default('4174757'),
            bid: Joi.string().required().min(2).default('20')
          }
        }
      },
      handler: function (req, h) {
        return ((async () => {
          const browser = await puppeteer.launch({
            'args': [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ]
          })
          const page = await browser.newPage()

          await page.goto('https://www.namejet.com/Pages/Login.aspx')
          await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtUsername')
          await page.type('#ctl00_ContentPlaceHolder1_txtUsername', req.params.username)
          await page.type('#ctl00_ContentPlaceHolder1_txtPassword', req.params.password)
          await page.click('#ctl00_ContentPlaceHolder1_btnSubmit')
          await page.waitForSelector('#ctl00_ContentPlaceHolder1_MyAccountNav1_pnlAccountOwner')

          await page.goto('https://www.namejet.com/Pages/Auctions/StandardDetails.aspx?lt=myauctions&auctionid=' + req.params.domain)
          await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtBidAmount')

          // Read the current price before continuing
          let price = await page.$eval('#ctl00_ContentPlaceHolder1_LabelMinimumBid', el => el.textContent)
          price = Number(price.replace(/\$(\d+).*/gi, '$1'))

          if (price <= req.params.bid) {
            console.log('Price at ' + price)

            // Make sure we don't append a price!
            const bidPrice = await page.$('#ctl00_ContentPlaceHolder1_txtBidAmount')
            await bidPrice.click({ clickCount: 3 })

            await bidPrice.type(req.params.bid)
            await page.click('#ctl00_ContentPlaceHolder1_ButtonPlaceBid')

            // await page.screenshot({ path: req.params.domain + '_bid-ready.png' })

            await page.waitFor(4000)

            console.log('Successful bid at ' + req.params.bid)

            // await page.screenshot({ path: req.params.domain + '_bid-complete.png' })

            await browser.close()

            return {
              statusCode: 200,
              statusText: 'Success',
              message: 'Successful bid at ' + req.params.bid
            }
          } else {
            console.log('The price is already at ' + price)
            // await page.screenshot({ path: req.params.domain + '_bid-aborted.png' })
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
