import { ChangeEventHandler, DragEventHandler, useCallback, useState } from 'react'
import { useEmailSender } from './useEmailSender'

export const useDragInput = () => {
  const { sendEmails, reset, ...state } = useEmailSender()
  const [dragActive, setDragActive] = useState(false)
  const [emails, setEmails] = useState<ReadonlyArray<string>>()
  const [fileList, setFileList] = useState<FileList>()

  const fileNames = fileList && Array.from(fileList).map((f) => f.name)

  // handle drag events
  const handleDrag: DragEventHandler<HTMLFormElement | HTMLDivElement> = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const extractEmails = useCallback((files: FileList) => {
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
  }, [])

  const handleDrop: DragEventHandler<HTMLFormElement | HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        reset()
        setFileList(e.dataTransfer.files)
        extractEmails(e.dataTransfer.files)
      }
    },
    [extractEmails, reset],
  )

  // triggers when file is selected with click
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        reset()
        setFileList(e.target.files)
        extractEmails(e.target.files)
      }
    },
    [extractEmails, reset],
  )

  const handleSendEmail = useCallback(async () => {
    if (emails !== undefined) {
      try {
        await sendEmails(emails)
        setFileList(undefined)
        setEmails(undefined)
      } catch (err) {
        console.log(err)
      }
    }
  }, [emails, sendEmails])

  return { handleDrag, dragActive, handleDrop, handleChange, handleSendEmail, emails, fileNames, ...state }
}
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
