const { apiRequest } = require('./body')

module.exports = {
  key: 'bodyWeight',
  noun: 'Body Weight',
  display: {
    label: 'Get Body Weight',
    description: 'Triggers when a new body weight measurement is added.'
  },
  operation: {
    inputFields: [],
    perform: (z, bundle) => apiRequest('weight', z, bundle),
    sample: {
      id: '1330991999000-weight-2012-03-05T23:59:59',
      bmi: 23.57,
      date: '2015-03-05',
      logId: 1330991999000,
      time: '23:59:59',
      weight: 73,
      source: 'Aria'
    },
    outputFields: [
      {
        key: 'bmi',
        label: 'BMI'
      },
      {
        key: 'date',
        label: 'Date'
      },
      {
        key: 'logId',
        label: 'Log ID'
      },
      {
        key: 'time',
        label: 'Time'
      },
      {
        key: 'weight',
        label: 'Weight'
      },
      {
        key: 'source',
        label: 'Source'
      },
    ]
  }
}
