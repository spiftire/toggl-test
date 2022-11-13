import { useCallback, useReducer } from 'react'
import { makeSendEmailsRequest } from './makeSendEmailRequest'

export const useEmailSender = () => {
  const [state, dispatch] = useReducer<typeof emailSenderReducer>(emailSenderReducer, {
    isLoading: false,
    error: undefined,
    status: 'IDLE',
  })

  const sendEmails = useCallback(async (emails: ReadonlyArray<string>) => {
    dispatch({ type: 'send emails', emails })
    try {
      await makeSendEmailsRequest(emails)
      dispatch({ type: 'success' })
    } catch (error) {
      console.error('🚀 ~ sendEmails ~ error', error)
      if (error instanceof Error && error.message.includes('Unexpected end of JSON')) {
        return dispatch({ type: 'success' })
      }
      dispatch({ type: 'error', error })
    }
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  return { ...state, sendEmails, reset }
}
type ReducerActions =
  | { type: 'success' }
  | { type: 'send emails'; emails: ReadonlyArray<string> }
  | { type: 'error'; error: unknown }
  | { type: 'reset' }
export type Status = 'SUCCESS' | 'FAILED' | 'IDLE' | 'SENDING'

type State = { isLoading: boolean; error?: unknown; status: Status }
const emailSenderReducer = (state: State, action: ReducerActions): State => {
  switch (action.type) {
    case 'success':
      return { ...state, isLoading: false, status: 'SUCCESS' }
    case 'send emails':
      return { ...state, isLoading: true, error: undefined, status: 'SENDING' }
    case 'error':
      return { ...state, isLoading: false, error: action.error, status: 'FAILED' }
    case 'reset':
      return { ...state, isLoading: false, error: undefined, status: 'IDLE' }
  }
}
