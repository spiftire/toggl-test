const API_URL = 'https://toggl-hire-frontend-homework.onrender.com'
export const makeSendEmailsRequest = async (emails: ReadonlyArray<string>) => {
  try {
    const response = await fetch(`${API_URL}/api/send`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ emails }),
    })
    if (response.status !== 200) {
      throw response
    }
    const parsedResponse = await response.json()
    return parsedResponse
  } catch (err) {
    if (err instanceof Error) {
      console.log('🚀 ~ makeSendEmailsRequest ~ err', { err })
    }
    throw err
  }
}
