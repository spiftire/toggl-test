import { Status } from './useEmailSender'

export const StatusMessage = ({ status, error }: { status: Status; error: unknown }) => {
  return (
    <>
      {status === 'FAILED' && (
        <>
          <div
            style={{
              padding: '1rem',
              border: 'solid 1px Salmon',
              backgroundColor: 'indianred',
              borderRadius: '.25rem',
            }}
          >
            Something went wrong
          </div>
          {error && isServerError(error) && (
            <div>
              <h2>Email could not be sent to following addresses</h2>
              <ul>
                {error.emails.map((email) => (
                  <li key={email}> {email}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      {status === 'SUCCESS' && (
        <div
          style={{
            padding: '1rem',
            border: 'solid 1px LimeGreen',
            backgroundColor: 'palegreen',
            borderRadius: '.25rem',
          }}
        >
          Emails send successfully
        </div>
      )}
    </>
  )
}

const isServerError = (error: unknown): error is APIError => {
  return typeof error === 'object' && error != null && 'emails' in error
}

type APIError = { emails: string[]; error: 'send_failure' }
