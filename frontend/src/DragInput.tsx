import { ChangeEventHandler, DragEventHandler, useRef, useState } from 'react'
import './DragInput.css'

/**
 * Inspired by https://www.codemzy.com/blog/react-drag-drop-file-upload
 */
export const DragInput = () => {
  const { handleDrag, dragActive, handleDrop, handleChange } = useDragInput()
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
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  }

  // triggers when file is selected with click
  const handleChange: ChangeEventHandler<HTMLInputElement> = function (e) {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      // at least one file has been selected so do something
      // handleFiles(e.target.files);
    }
  }

  return { handleDrag, dragActive, handleDrop, handleChange }
}
