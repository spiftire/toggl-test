import { ChangeEventHandler, DragEventHandler, FC, useEffect, useRef, useState } from 'react'
import './DragInput.css'

/**
 * Inspired by https://www.codemzy.com/blog/react-drag-drop-file-upload
 */
export const DragInput: FC<{ onEmailChange: (emails: ReadonlyArray<string>) => void }> = ({ onEmailChange }) => {
  const { handleDrag, dragActive, handleDrop, handleChange, emails } = useDragInput()

  useEffect(() => {
    if (emails !== undefined) {
      onEmailChange(emails)
    }
  }, [emails, onEmailChange])

  const inputRef = useRef<HTMLInputElement>(null)
  return (
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
  )
}
const useDragInput = () => {
  const [dragActive, setDragActive] = useState(false)
  const [emails, setEmails] = useState<ReadonlyArray<string>>()

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
      extractEmails(e.dataTransfer.files)
    }
  }

  // triggers when file is selected with click
  const handleChange: ChangeEventHandler<HTMLInputElement> = function (e) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      extractEmails(e.target.files)
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

  return { handleDrag, dragActive, handleDrop, handleChange, emails }
}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
