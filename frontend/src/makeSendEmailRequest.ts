const API_URL = 'https://toggl-hire-frontend-homework.onrender.com'
export const makeSendEmailsRequest = async (emails: ReadonlyArray<string>) => {
  return (
    await fetch(`${API_URL}/api/send`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ emails }),
    })
  ).json()
}
