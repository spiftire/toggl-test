import { Status } from './useEmailSender'

export const StatusMessage = ({ status, error }: { status: Status; error: unknown }) => {
  return (
    <>
      {status === 'FAILED' && <div>Something went wrong</div>}
      {status === 'SUCCESS' && <div>Emails send successfully</div>}
    </>
  )
}
