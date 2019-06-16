const puppeteer = require('puppeteer')
var Joi = require('@hapi/joi')

// Options can be passed to plugins on registration
exports.plugin = {
  name: 'marketplaces/afternic', // Must be unique
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/marketplaces/afternic',
      config: {
        tags: ['api', 'marketplace', 'afternic'],
        description: 'Afternic Seller',
        notes: 'Sell domains on Afternic',
        validate: {
          payload: {
            username: Joi.string().required().default('user'),
            password: Joi.string().required().default('password'),
            domain: Joi.string().required().default('test.com'),
            description: Joi.string().default('{domain} is a great brand that will inspire people and you can be certain they will remember it.'),
            category: Joi.number()
              .allow(1, 30, 44, 58, 69, 85, 105, 141, 169, 190, 199, 213, 231, 250, 278, 300, 1001)
              .description(`
                Acronyms (1001)
                Business (1)
                Careers (30)
                Computers (44)
                Education (58)
                Family Life (69)
                Financial (85)
                Health (105)
                Home (141)
                Recreation (169)
                Reference (190)
                Region (199)
                Shopping (250)
                Society (278)
                Special Events (213)
                Sports (231)
                Travel (300)
              `),
            subcategory: Joi.number()
              .allow(2, 3, 5, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 59, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 83, 84, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 142, 143, 144, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 170, 171, 172, 174, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 191, 192, 193, 194, 195, 196, 197, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 210, 211, 212, 214, 216, 217, 218, 219, 223, 224, 226, 227, 228, 229, 230, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 264, 265, 266, 267, 268, 271, 273, 274, 275, 279, 280, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 298, 299, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 363, 364, 365, 366, 367, 368, 369, 370, 371, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 388, 389, 390, 391, 393, 394, 1000, 1002, 1003, 1004, 1005)
              .description(`
                -- Acronyms --
                  1 & 2 Characters (1002)
                  3 Characters (1003)
                  4+ Characters (1004)

                -- Business --
                  Advertising (2)
                  Aerospace (3)
                  B2B (5)
                  Chemicals (7)
                  Customer Service (8)
                  Defense (9)
                  Electronics and Semiconductors (12)
                  Energy (13)
                  Farm and Agriculture (14)
                  Franchising (15)
                  General (374)
                  Imports/Exports (16)
                  Industry (17)
                  Management (18)
                  Mining (19)
                  On-Line (20)
                  Pharmaceuticals (21)
                  Professional Services (22)
                  Public Relations (23)
                  Publishing (24)
                  Retail (25)
                  Sales and Marketing (26)
                  Small Business (10)
                  Telecommunications (28)
                  Textiles (27)
                  Transportation (29)

                -- Careers --
                  Assessment (31)
                  Career Guides (32)
                  Career Management (33)
                  Employment Agencies (34)
                  General (375)
                  HR Services (36)
                  Job Information (37)
                  Job Networking (38)
                  Job Sites (39)
                  Outplacement (35)
                  Regional Opportunities (40)
                  Resume Services (41)
                  Self Employment (42)
                  Training (43)
                
                -- Computers --
                  Consulting (46)
                  Games (48)
                  General (376)
                  Graphics (49)
                  Hardware (50)
                  Information Technology (52)
                  Internet (51)
                  Multimedia (53)
                  Programming (54)
                  Software (55)
                  Technology (56)
                  Windows (57)

                -- Education --
                  Adult Education (59)
                  Colleges and Universities (61)
                  Educational Testing (62)
                  Financial Aid (63)
                  General (377)
                  Home Schooling (64)
                  K to 12 (65)
                  Online (66)
                  Preschools (67)
                  Special Education (68)

                -- Family Life --
                  Adoption (70)
                  Babies (71)
                  Divorce (73)
                  Family Names (75)
                  Food and Drink (72)
                  Genealogy (76)
                  General (378)
                  Kids (77)
                  Life Events (78)
                  Lifestyle (79)
                  Makeovers (373)
                  Parenting (369)
                  Pets (80)
                  Pre-Schoolers (81)
                  Teens (83)
                  Weddings (84)

                -- Financial --
                  Accounting (86)
                  Banking Services (87)
                  Business Services (88)
                  Cash (89)
                  Collections (90)
                  Commodities (91)
                  Consultants (92)
                  Credit Cards (93)
                  Debt Consolidation (94)
                  Financial Planning (96)
                  Financing (95)
                  General (390)
                  Insurance (98)
                  Investing (97)
                  Leasing (99)
                  Loans (100)
                  Mortgages (101)
                  Payroll Services (102)
                  Retirement (353)
                  Taxes (103)
                  Venture Capital (104)

                -- Health --
                  Addiction (106)
                  Allergies (107)
                  Alternative (108)
                  Child health (109)
                  Cosmetic Surgery (110)
                  Dentistry (111)
                  Diseases (112)
                  Eyes (113)
                  Fitness (114)
                  General (379)
                  Health Blogs &amp; Boards (115)
                  Health Practitioners (117)
                  Health Seminars (118)
                  Healthy Living (119)
                  Hospitals and Clinics (364)
                  Insurance (120)
                  Medicine (121)
                  Mens Health (122)
                  Mental Health (123)
                  Nursing (124)
                  Nutrition (370)
                  Pain Management (125)
                  Pharmacy (126)
                  Pregnancy (127)
                  Products (128)
                  Public Health (129)
                  Self Assessment (130)
                  Self Help (131)
                  Senior Health (132)
                  Sexual health (134)
                  Sports Medicine (136)
                  Stress Management (133)
                  Weight Loss (137)
                  Wellness (139)
                  Womens Health (140)
                  Work Place Health (138)

                -- Home --
                  Appraisals (143)
                  Do-it-yourself (144)
                  Furniture (146)
                  Gardening (147)
                  General (380)
                  Home Accessories (142)
                  Home Entertainment (149)
                  Home Improvement (148)
                  Home Security (154)
                  Moving (150)
                  Plants (151)
                  Real Estate (152)
                  Real Estate Agents (153)

                -- Recreation --
                  Aviation (171)
                  Boating (172)
                  Books (253)
                  Cartoons (170)
                  Computer Games (179)
                  Fun and Humor (178)
                  Games (174)
                  General (386)
                  Hobbies (180)
                  Movies (182)
                  Music (183)
                  People (184)
                  Performing Arts (185)
                  Photography (155)
                  Popular Culture (181)
                  Radio (186)
                  Restaurants and Bars (177)
                  TV (187)
                  Video Games (189)
                  Videos (188)
                  Wine (318)
                  Writing (368)

                -- Reference --
                  Acronyms (191)
                  Almanacs Books and Guides (192)
                  Dictionaries (193)
                  Directories (194)
                  General (385)
                  Information Sources (195)
                  Maps (196)
                  News (197)
                  Numbers (393)
                  One Word (1005)
                  Uncategorized (1000)
                  Weather (198)

                -- Region --
                  Africa (200)
                  American Cities (201)
                  American States (202)
                  Asia (203)
                  Canada (209)
                  Caribbean (204)
                  Central America (206)
                  Dutch (355)
                  Europe (207)
                  French (356)
                  General (391)
                  German (358)
                  IDNs (394)
                  Italian (357)
                  Middle East (208)
                  Oceania (210)
                  Other Languages (359)
                  Portuguese (360)
                  South America (211)
                  Spanish (354)
                  United States of America (212)
                  
                -- Shopping --
                  Automotive (251)
                  Beauty (252)
                  Cameras (254)
                  Cell Phones (255)
                  Collectibles (256)
                  Crafts (257)
                  Discounts (258)
                  Electronics (259)
                  Fashion and Apparel (260)
                  Flowers (261)
                  General (388)
                  Gifts (264)
                  Household (265)
                  Jewelry (266)
                  Office Supplies (267)
                  Online Shopping (268)
                  Sporting Goods (271)
                  Tickets (273)
                  Tools (274)
                  Toys (275)

                -- Society --
                  Causes (279)
                  Charities (280)
                  Community (363)
                  Crime (282)
                  Dating Services (365)
                  Death and Dying (283)
                  Economics (284)
                  Ethnic (285)
                  Fine Art (286)
                  Galleries (371)
                  General (389)
                  Government (287)
                  History (288)
                  Law (289)
                  Military (290)
                  Miscellaneous (361)
                  Nature and Animals (291)
                  Paranormal (292)
                  Personal Ads (367)
                  Philosophy (293)
                  Politics (294)
                  Regional Dating (366)
                  Religion (295)
                  Science (296)
                  Sexuality (298)
                  Social Sciences (299)
                  Spirituality (135)
                  Vice (352)

                -- Special Events --
                  Christmas (214)
                  Easter (216)
                  Fathers Day (217)
                  General (384)
                  Halloween (218)
                  Independence Day (219)
                  Mothers Day (223)
                  New Years Eve (224)
                  Other Holidays (230)
                  Spring Break (226)
                  St. Patricks Day (227)
                  Thanksgiving (228)
                  Valentines Day (229)

                -- Sports --
                  Baseball (232)
                  Basketball (233)
                  Biking (234)
                  Boxing (235)
                  Equestrian (236)
                  Extreme Sports (237)
                  Fantasy Sports (176)
                  Fishing (238)
                  Football (239)
                  General (382)
                  Golf (240)
                  Hockey (241)
                  Hunting (242)
                  Mountain Climbing (243)
                  Other Sports (383)
                  Racing (244)
                  Skiing (245)
                  Soccer (246)
                  Sports Magazines (247)
                  Sports Tickets (248)
                  Tennis (249)

                -- Travel --
                  Adventures (301)
                  Air Travel (302)
                  Boating (303)
                  Business Travel (304)
                  Camping (306)
                  Car Rentals (305)
                  Cruises (308)
                  Ecotourism (309)
                  General (381)
                  Honeymoons (310)
                  Hotels (311)
                  Photo Vacations (312)
                  Popular Destinations (307)
                  Theme Parks (313)
                  Tourism (314)
                  Travel Agents (315)
                  Travel Insurance (316)
                  Vacation Packages (317)
              `),
            minoffer: Joi.number().default('1000'),
            reserve: Joi.number().default('5000'),
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

          await page.goto('https://www.afternic.com/login')

          // Login
          await page.waitForSelector('#login-account-name')
          await page.type('#login-account-name', req.payload.username)
          await page.type('#login-password', req.payload.password)
          await page.click('#login-submit')
          await page.waitForSelector('#module-dashboard')

          // Step 1 - Add Domains
          await page.goto('https://www.afternic.com/add_domains/step1')
          await page.waitForSelector('#tagit-new-txt')

          await page.type('#tagit-new-txt', req.payload.domain)
          await page.type('#tagit-new-txt', ' ')
          await page.waitForSelector('#add-domains-names-tagsinput > li.tagit-choice')

          await page.click('#add-domains-step1-submit')

          // Step 2 - Set Pricing
          await page.waitForSelector('#add-domains-step2-submit')

          const binPrice = await page.$('#domains-buynow-0')
          await binPrice.click({ clickCount: 3 })
          await binPrice.type(req.payload.bin.toString())

          const reservePrice = await page.$('#domains-floor-0')
          await reservePrice.click({ clickCount: 3 })
          await reservePrice.type(req.payload.reserve.toString())

          const minofferPrice = await page.$('#domains-min-price-0')
          await minofferPrice.click({ clickCount: 3 })
          await minofferPrice.type(req.payload.minoffer.toString())

          await page.click('#add-domains-step2-submit')

          // Step 3 - Review listings
          await page.waitForSelector('#add-domains-step3-submit')

          // await page.screenshot({ path: req.payload.domain + '_afternic_added.png' })

          await page.click('#add-domains-step3-submit')
          await page.waitForSelector('#content-wrap > div.content-indented > h3:nth-child(1)')

          // Set domain category
          await page.goto('https://www.afternic.com/editdomain/' + req.payload.domain)
          await page.waitForSelector('#edit-category-select > option:nth-child(2)')

          page.select('#edit-category-select', req.payload.category.toString())
          await page.waitFor(2000)

          page.select('#edit-subcategory-select', req.payload.subcategory.toString())

          // Set description
          const description = await page.$('#description')
          await description.click({ clickCount: 3 })
          await description.type(req.payload.description.replace(/{domain}/g, req.payload.domain))

          await page.click('#saveBtn5')
          await page.waitForNavigation()

          await browser.close()

          return {
            statusCode: 200,
            statusText: 'Success',
            message: 'Successful added ' + req.payload.domain
          }
        })())
      }
    })
  }
}
