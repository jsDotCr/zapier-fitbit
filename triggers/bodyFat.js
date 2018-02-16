const { apiRequest } = require('./body')

module.exports = {
  key: 'bodyFat',
  noun: 'Body Fat',
  display: {
    label: 'Get Body Fat',
    description: 'Triggers when a new body fat measurement is added.'
  },
  operation: {
    inputFields: [],
    perform: (z, bundle) => apiRequest('fat', z, bundle),
    sample: {
      date: '2012-03-05',
      fat: 14,
      logId: 1330991999000,
      time: '23:59:59',
      source: 'API'
    },
    outputFields: [
      {
        key: 'date',
        label: 'Date'
      },
      {
        key: 'fat',
        label: 'Fat (%)'
      },
      {
        key: 'logId',
        label: 'Log ID'
      },
      {
        key: 'time',
        label: 'Time'
      },
    ]
  }
}
