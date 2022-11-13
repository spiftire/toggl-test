import { Status } from './useEmailSender'

export const StatusMessage = ({ status, error }: { status: Status; error: unknown }) => {
  return (
    <>
      {status === 'FAILED' && (
        <div
          style={{ padding: '1rem', border: 'solid 1px Salmon', backgroundColor: 'indianred', borderRadius: '.25rem' }}
        >
          Something went wrong
        </div>
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
