import {Note, Tag } from "./App"
import { NoteForm } from "./NoteForm"
import { useNote } from "./NoteLayout"

type EditNoteProps = {
  onSubmit: ( data: Note, id?: string) => void
  availableTags: Tag[]
}

export function EditNote({ onSubmit, availableTags }: EditNoteProps) {
  const note = useNote()
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        Title={note.Title}
        Body={note.Body}
        Tags={note.Tags}
        onSubmit={data => onSubmit(data, note.ID)}
        availableTags={availableTags}
      />
    </>
  )
}
