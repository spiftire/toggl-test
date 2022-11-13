import { FC, useRef } from 'react'
import './DragInput.css'
import { Spinner } from './Spinner'
import { StatusMessage } from './StatusMessage'
import { useDragInput } from './useDragInput'

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
            <p>Drag and drop your file containing emails here or</p>
            <button
              className="upload-button"
              onClick={(e) => {
                e.preventDefault()
                inputRef.current?.click()
              }}
            >
              Click here to upload a file
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
          <h2>Files to upload</h2>
          <ul style={{ listStyle: 'none' }}>
            {fileNames.map((fn) => (
              <li
                key={fn}
                style={{ padding: '.5rem', border: 'solid lightgrey 1px', borderRadius: '.25rem', margin: ' .5rem 0' }}
              >
                {fn}
              </li>
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
