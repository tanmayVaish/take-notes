import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

interface NoteLayoutProps {
  notes: Note[]
}

export function NoteLayout({notes} : NoteLayoutProps) {
  const { id } = useParams()

  const note = notes.find(note => note.ID == id)

  if (note == null) return <Navigate to="/" replace />

  return <Outlet context={note} />
}

export function useNote() {
  return useOutletContext<Note>()
}
