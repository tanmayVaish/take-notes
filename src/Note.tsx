import { Badge, Button, Col, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useNote } from "./NoteLayout"
import ReactMarkdown from "react-markdown"
import { Tag } from "./App"

type NoteProps = {
  onDelete: (id?: string) => void
  availableTags: Tag[]
}

export function Note({ onDelete, availableTags }: NoteProps) {
  const note = useNote()
  const navigate = useNavigate()

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.Title}</h1>
          {note.Tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.Tags.map(tag => {
                const tagName = availableTags.find(
                  availableTag => availableTag.ID === tag.ID
                )?.Name
                if (!tagName) {
                  return null
                }
                return (
                <Badge className="text-truncate" key={tag.ID}>
                  {tag.Name}
                </Badge>
              )})}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.ID}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button
              onClick={() => {
                onDelete(note.ID)
                navigate("/")
              }}
              variant="outline-danger"
            >
              Delete
            </Button>
            <Link to="/">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.Body}</ReactMarkdown>
    </>
  )
}
