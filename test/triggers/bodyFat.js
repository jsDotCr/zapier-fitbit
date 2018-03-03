/* globals describe it */
const moment = require('moment')
const should = require('should')
const zapier = require('zapier-platform-core')
const nock = require('nock')

const App = require('../../index')
const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('Fitbit App', () => {
  it('should fetch last month\'s data', done => {
    const today = moment().format('YYYY-MM-DD')
    const oneMonthAgo = moment().subtract(1, 'month').format('YYYY-MM-DD')
    const bundle = { inputData: {} }
    nock('https://api.fitbit.com/1')
      .replyContentLength()
      .get(new RegExp(`/user/-/body/log/fat/date/${oneMonthAgo}/${today}.json`))
      .query(bundle.inputData)
      .reply(200, {
        'fat': [
          {
            'date': '2012-03-05',
            'fat': 14,
            'logId': 1330991999000,
            'time': '23:59:59',
            'source': 'API'
          }
        ]
      })

    appTester(App.triggers.bodyFat.operation.perform, bundle)
      .then(results => {
        should.exist(results)
        done()
      })
      .catch(done)
  })

  it('should run triggers.bodyFat', done => {
    const bundle = { inputData: {} }
    nock('https://api.fitbit.com/1')
      .replyContentLength()
      .get(/\/user\/-\/body\/log\/fat\/date.*\.json/)
      .query(bundle.inputData)
      .reply(200, {
        'fat': [
          {
            'date': '2012-03-05',
            'fat': 14,
            'logId': 1330991999000,
            'time': '23:59:59',
            'source': 'API'
          },
          {
            'date': '2012-03-05',
            'fat': 13.5,
            'logId': 1330991999000,
            'time': '21:20:59',
            'source': 'Aria'
          }
        ]
      }
      )

    appTester(App.triggers.bodyFat.operation.perform, bundle)
      .then(results => {
        results.length.should.equal(2)
        done()
      })
      .catch(done)
  })
})
