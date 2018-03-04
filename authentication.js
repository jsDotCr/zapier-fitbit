function getHeaders (clientId, clientSecret) {
  const headers = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  if (clientId && clientSecret) {
    headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  }
}

const getAccessToken = (z, bundle) => {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const request = z.request('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    body: {
      code: bundle.inputData.code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      state: '{{bundle.inputData.state}}',
      redirect_uri: '{{bundle.inputData.redirect_uri}}'
    },
    headers: getHeaders(clientId, clientSecret)
  })

  // Needs to return at minimum, `access_token`, and if your app also does refresh, then `refresh_token` too
  return request.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content)
    }

    const result = z.JSON.parse(response.content)
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token
    }
  })
}

const refreshAccessToken = (z, bundle) => {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const request = z.request('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    body: {
      grant_type: 'refresh_token',
      refresh_token: bundle.authData.refresh_token,
      expires_in: process.env.TOKEN_EXPIRE_TIME || 28800
    },
    headers: getHeaders(clientId, clientSecret)
  })

  return request.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content)
    }

    const result = z.JSON.parse(response.content)
    return {
      access_token: result.access_token
    }
  })
}

const testAuth = (z, bundle) => {
  const promise = z.request({
    method: 'POST',
    url: 'https://api.fitbit.com/oauth2/introspect',
    headers: getHeaders(),
    body: {
      token: bundle.authData.access_token
    }
  })

  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The access token you supplied is not valid')
    }
    return response
  })
}

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      url: 'https://www.fitbit.com/oauth2/authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
        scope: '{{process.env.SCOPE}}',
        expires_in: '2592000'
      }
    },
    getAccessToken: getAccessToken,
    refreshAccessToken: refreshAccessToken,
    autoRefresh: true
  },
  test: testAuth
}
