import { Note, Tag} from "./App"
import { NoteForm } from "./NoteForm"

type NewNoteProps = {
  onSubmit: (data: Note) => void
  availableTags: Tag[]
}

export function NewNote({ onSubmit, availableTags }: NewNoteProps) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm
        onSubmit={onSubmit}
        availableTags={availableTags}
      />
    </>
  )
}
