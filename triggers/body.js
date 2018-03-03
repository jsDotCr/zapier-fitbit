const moment = require('moment')

exports.apiRequest = function apiRequest (what, z, bundle) {
  const today = moment()
  const oneMonthAgo = moment().subtract(1, 'month')
  const dataFormat = 'YYYY-MM-DD'
  const responsePromise = z.request({
    url: `https://api.fitbit.com/1/user/-/body/log/${what}/date/${oneMonthAgo.format(dataFormat)}/${today.format(dataFormat)}.json`
  })
  return responsePromise
    .then(response => z.JSON.parse(response.content)[what])
    .then(items => items
      .map(item => Object.assign({
        id: item.logId
      }, item))
      .reverse()
    )
}
