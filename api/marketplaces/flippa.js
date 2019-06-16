const puppeteer = require('puppeteer')
var Joi = require('@hapi/joi')

// Options can be passed to plugins on registration
exports.plugin = {
  name: 'marketplaces/flippa', // Must be unique
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/marketplaces/flippa',
      config: {
        tags: ['api', 'marketplace', 'flippa'],
        description: 'Flippa Seller',
        notes: 'Sell domains on Flippa',
        validate: {
          payload: {
            username: Joi.string().required().default('user'),
            password: Joi.string().required().default('password'),
            domain: Joi.string().required().default('test.com'),
            minoffer: Joi.number().default('1000'),
            bin: Joi.number().default('10000')
          }
        }
      },
      handler: function (req, h) {
        return ((async () => {
          const browser = await puppeteer.launch({
            // headless: false,
            // devtools: true,
            'args': [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ]
          })
          const page = await browser.newPage()

          await page.goto('https://www.flippa.com/sign-in')

          // Login
          await page.waitForSelector('#session_email')

          await page.type('#session_email', req.payload.username)
          await page.type('#session_password', req.payload.password)
          await page.click('div.form__actions > input')
          await page.waitForSelector('body > main > article > h1')

          // Step 1 - Add Domains
          await page.goto('https://flippa.com/domain-catalogs/wizard')

          await page.waitForSelector('a.cc-dismiss')
          await page.click('a.cc-dismiss')

          await page.waitForSelector('#domains')
          await page.type('#domains', req.payload.domain)
          await page.waitFor(1000)
          await page.click('input[name="commit"]')

          // Step 2 - Set price
          await page.waitForSelector('#minimum_offer')

          const minOffer = await page.$('#minimum_offer')
          await minOffer.click({ clickCount: 3 })
          await minOffer.type(req.payload.minoffer.toString())

          const bin = await page.$('#buy_it_now')
          await bin.click({ clickCount: 3 })
          await bin.type(req.payload.bin.toString())

          await page.click('input[name="commit"]')

          await page.waitForSelector('#new_catalog_wizard_confirmation_form')
          await page.click('input[name="commit"]')

          await page.waitForSelector('span.Well--inline')
          const txtRecord = await page.evaluate(() => document.querySelector('span.Well--inline').innerText)

          await browser.close()

          return {
            statusCode: 200,
            statusText: 'Success',
            txtRecord: txtRecord,
            message: 'Successful added ' + req.payload.domain
          }
        })())
      }
    })
  }
}
