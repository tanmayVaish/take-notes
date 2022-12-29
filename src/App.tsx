import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

export interface Note {
  ID?: string 
  Title: string
  Body: string
  Tags: Tag[]
}

export interface Tag {
  ID?: string
  Name: string
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    // fetch using axios notes and tags from backend
    fetch("http://localhost:5000/api/notes")
      .then(response => response.json())
      .then(data => {
        // console.log({data});
        setNotes(data)
      })
    fetch("http://localhost:5000/api/tags")
      .then(response => response.json())
      .then(data => {
        setTags(data)
      })
  }, [])

  // const notesWithTags = useMemo(() => {
  //   return notes.map(note => {
  //     return { ...note, tags: tags.filter(tag => note.id.includes(tag.id)) }
  //   })
  // }, [notes, tags])

  function onCreateNote(data : Note) {
    
    // Post request to backend "http://localhost:5000/api/note"
    fetch("http://localhost:5000/api/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data)
        setNotes(prevNotes => {
          return [...prevNotes, data]
        }
        )
      })
      .catch(error => {
        console.error("Error:", error)
      })
  }

  function onUpdateNote( { Tags, ...data }: Note, id?: string) {

    console.log("data", data);
    

    fetch("http://localhost:5000/api/note/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data)
      })
      .catch(error => {
        console.error("Error:", error)
      })


    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.ID === id) {
          return { ...note, ...data, Tags: Tags }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id?: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.ID !== id)
    })
  }

  function updateTag(label: string, id?: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.ID === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id?: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.ID !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notes}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notes} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
