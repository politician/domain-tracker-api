const puppeteer = require('puppeteer')
var Joi = require('@hapi/joi')

// Options can be passed to plugins on registration
exports.plugin = {
  name: 'auctions/dropcatch', // Must be unique
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/auctions/dropcatch/{username}/{password}/{domain}/{bid}',
      config: {
        tags: ['api', 'auction', 'dropcatch'],
        description: 'Dropcatch bidder',
        notes: 'Bid on a dropcatch.com auction domain',
        validate: {
          params: {
            username: Joi.string().required().default('WeContract73'),
            password: Joi.string().required().default('J6K5UMCB'),
            domain: Joi.string().required().default('actuals.com'),
            bid: Joi.string().required().min(2).default('222')
          }
        }
      },
      handler: function (req, h) {
        return (async () => {
          const browser = await puppeteer.launch({
            'args': [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ]
          })
          const page = await browser.newPage()

          await page.goto('https://www.dropcatch.com')
          await page.type('input[name=userName]', req.params.username)
          await page.type('input[name=Password]', req.params.password)
          await page.click('#header > div.logoRow.wrap > form > div > button')

          await page.goto('https://www.dropcatch.com/Domain/' + req.params.domain)

          // Read the current price before continuing
          let price = await page.$eval('#auPlaceBid', el => el.value)
          price = Number(price.replace(/,/g, ''))

          if (price <= req.params.bid) {
            console.log('Price at ' + price)

            const bidPrice = await page.$('#auPlaceBid')

            // Make sure we don't append a price!
            await bidPrice.click({ clickCount: 3 })

            await bidPrice.type(req.params.bid)
            await page.click('#main > div.bidBox.cyanBox > div > div.auc_h_wrap.auc_place_bid_row > div > form > div:nth-child(1) > button')

            // Wait for confirmation popup
            const bidPriceConfirmSelector = '#popupContent > div > div.sub > div:nth-child(3) > div.bidInfo.mb > dl:nth-child(3) > input[type=text]'
            await page.waitForSelector(bidPriceConfirmSelector)

            const bidPriceConfirm = await page.$(bidPriceConfirmSelector)

            // Read the current price before continuing
            let priceConfirm = Number(await page.$eval(bidPriceConfirmSelector, el => el.value))
            if (priceConfirm <= req.params.bid) {
              console.log('Bid at ' + priceConfirm)

              // Make sure we don't append a price!
              await bidPriceConfirm.click({ clickCount: 3 })
              await bidPriceConfirm.type(req.params.bid)
              // await page.screenshot({ path: req.params.domain + '_bid-ready.png' })

              await page.click('#popupContent > div > div.sub > div:nth-child(3) > div.submit.confirmBid.mb12 > a.cssbtn2')

              await page.waitForSelector('#popupContent > div > div.sub > div.text > div > table > tbody > tr > td.dom > b')

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
        })()
      }
    })
  }
}
