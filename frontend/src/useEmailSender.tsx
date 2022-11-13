import { useCallback, useReducer } from 'react'
import { makeSendEmailsRequest } from './makeSendEmailRequest'

export const useEmailSender = () => {
  const [state, dispatch] = useReducer<typeof emailSenderReducer>(emailSenderReducer, {
    isLoading: false,
    error: undefined,
  })

  const sendEmails = useCallback(async (emails: ReadonlyArray<string>) => {
    dispatch({ type: 'send emails', emails })
    try {
      await makeSendEmailsRequest(emails)
      dispatch({ type: 'success' })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }, [])
  return { ...state, sendEmail: sendEmails }
}
type ReducerActions =
  | { type: 'success' }
  | { type: 'send emails'; emails: ReadonlyArray<string> }
  | { type: 'error'; error: unknown }
type State = { isLoading: boolean; error?: unknown }
const emailSenderReducer = (state: State, action: ReducerActions): State => {
  switch (action.type) {
    case 'success':
      return { ...state, isLoading: false }
    case 'send emails':
      return { ...state, isLoading: true, error: undefined }
    case 'error':
      return { ...state, isLoading: false, error: action.error }
  }
}
