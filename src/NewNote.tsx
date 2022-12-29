import { Note, Tag } from "./App"
import { NoteForm } from "./NoteForm"

type NewNoteProps = {
  onSubmit: (data: Note) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  )
}
