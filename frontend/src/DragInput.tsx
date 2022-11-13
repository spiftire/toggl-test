import { ChangeEventHandler, DragEventHandler, FC, useRef, useState } from 'react'
import './DragInput.css'
import { Spinner } from './Spinner'
import { StatusMessage } from './StatusMessage'
import { useEmailSender } from './useEmailSender'

/**
 * Inspired by https://www.codemzy.com/blog/react-drag-drop-file-upload
 */
export const DragInput: FC = () => {
  const { handleDrag, dragActive, handleDrop, handleChange, fileNames, handleSendEmail, isLoading, error, status } =
    useDragInput()

  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <StatusMessage status={status} error={error} />
      <form id="form-file-upload" onDragEnter={handleDrag}>
        <input type="file" id="input-file-upload" multiple={true} onChange={handleChange} ref={inputRef} />
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button" onClick={() => inputRef.current?.click()}>
              Upload a file
            </button>
          </div>
          {dragActive && (
            <div
              id="drag-file-element"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          )}
        </label>
      </form>
      {fileNames && (
        <>
          <ul>
            {fileNames.map((fn) => (
              <li key={fn}>{fn}</li>
            ))}
          </ul>
          <button onClick={handleSendEmail} disabled={isLoading}>
            Send emails {isLoading && <Spinner />}
          </button>
        </>
      )}
    </>
  )
}
const useDragInput = () => {
  const { sendEmails, reset, ...state } = useEmailSender()
  const [dragActive, setDragActive] = useState(false)
  const [emails, setEmails] = useState<ReadonlyArray<string>>()
  const [fileList, setFileList] = useState<FileList>()

  const fileNames = fileList && Array.from(fileList).map((f) => f.name)

  // handle drag events
  const handleDrag: DragEventHandler<HTMLFormElement | HTMLDivElement> = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop: DragEventHandler<HTMLFormElement | HTMLDivElement> = function (e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      reset()
      setFileList(e.dataTransfer.files)
      extractEmails(e.dataTransfer.files)
    }
  }

  // triggers when file is selected with click
  const handleChange: ChangeEventHandler<HTMLInputElement> = function (e) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFileList(e.target.files)
      extractEmails(e.target.files)
    }
  }

  const handleSendEmail = async () => {
    if (emails !== undefined) {
      try {
        await sendEmails(emails)
        setFileList(undefined)
        setEmails(undefined)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const extractEmails = (files: FileList) => {
    const { length } = files
    const emailSet = new Set<string>()
    for (let index = 0; index < length; index++) {
      const file = files[index]
      if (file === null) {
        continue
      }
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = function (e) {
        const result = e.target?.result as string
        const lines = result.split('\n')
        for (const line of lines) {
          if (emailRegex.test(line)) {
            emailSet.add(line)
          }
        }
        setEmails(Array.from(emailSet))
      }
      reader.onerror = function (e) {
        console.log(e)
      }
    }
  }

  return { handleDrag, dragActive, handleDrop, handleChange, handleSendEmail, emails, fileNames, ...state }
}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
