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
            'logId': 1330991799000,
            'time': '23:59:59',
            'source': 'API'
          },
          {
            'date': '2012-03-06',
            'fat': 13.5,
            'logId': 1330991899000,
            'time': '21:20:59',
            'source': 'Aria'
          },
          {
            'date': '2012-03-07',
            'fat': 13.8,
            'logId': 1330991999000,
            'time': '20:20:59',
            'source': 'Aria'
          }
        ]
      }
      )

    appTester(App.triggers.bodyFat.operation.perform, bundle)
      .then(results => {
        results.length.should.equal(3)
        done()
      })
      .catch(done)
  })

  it('should reverse the order of elements', done => {
    const bundle = { inputData: {} }
    const elements = [
      {
        'date': '2012-03-05',
        'fat': 14,
        'logId': 1330991799000,
        'time': '23:59:59',
        'source': 'API'
      },
      {
        'date': '2012-03-06',
        'fat': 13.5,
        'logId': 1330991899000,
        'time': '21:20:59',
        'source': 'Aria'
      },
      {
        'date': '2012-03-07',
        'fat': 13.8,
        'logId': 1330991999000,
        'time': '20:20:59',
        'source': 'Aria'
      }
    ]
    nock('https://api.fitbit.com/1')
      .replyContentLength()
      .get(/\/user\/-\/body\/log\/fat\/date.*\.json/)
      .query(bundle.inputData)
      .reply(200, {
        fat: elements
      })

    appTester(App.triggers.bodyFat.operation.perform, bundle)
      .then(results => {
        results[0].date.should.equal(elements[elements.length - 1].date)
        results[results.length - 1].date.should.eql(elements[0].date)
        done()
      })
      .catch(done)
  })
})
