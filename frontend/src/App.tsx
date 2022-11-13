import { useState } from 'react'
import './App.css'
import { DragInput } from './DragInput'
import { EmailList } from './EmailList'

function App() {
  const [emails, setEmails] = useState<ReadonlyArray<string>>()

  return (
    <div className="App">
      <DragInput onEmailChange={setEmails} />
      {emails && <EmailList data={emails} />}
    </div>
  )
}

export default App
