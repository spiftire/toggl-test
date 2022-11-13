import { FC } from 'react'
import './EmailList.css'

export const EmailList: FC<{ data: ReadonlyArray<string> }> = ({ data }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.5rem' }}>
        <img src="/emailIcon.svg" alt="email icon" width="32px" />
        <h2>Emails:</h2>
      </div>
      <ul>
        {data.map((email) => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </div>
  )
}
