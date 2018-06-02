/* globals describe it */
const should = require('should')
const zapier = require('zapier-platform-core')
const nock = require('nock')

const App = require('../index')
const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('Fitbit App triggers: body weight', () => {
  it('should run triggers.bodyWeight', done => {
    const bundle = { inputData: {} }
    nock('https://api.fitbit.com/1')
      .replyContentLength()
      .get(/\/user\/-\/body\/log\/weight\/date.*\.json/)
      .query(bundle.inputData)
      .reply(200, {
        'weight': [
          {
            'bmi': 23.57,
            'date': '2015-03-04',
            'logId': 1330991899000,
            'time': '23:59:59',
            'weight': 73,
            'source': 'API'
          },
          {
            'bmi': 22.57,
            'date': '2015-03-05',
            'logId': 1330991999000,
            'time': '21:10:59',
            'weight': 72.5,
            'source': 'Aria'
          }
        ]
      })

    appTester(App.triggers.bodyWeight.operation.perform, bundle)
      .then(results => {
        should.exist(results)
        results.length.should.equal(2)
        done()
      })
      .catch(done)
  })
})
