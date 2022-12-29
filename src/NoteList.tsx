import { useEffect, useMemo, useState } from "react"
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Note, Tag } from "./App"
import styles from "./NoteList.module.css"
import NoteImage from "../assets/post-it.png"


type NoteListProps = {
  availableTags: Tag[]
  notes: Note[]
  onDeleteTag: (id?: string) => void
  onUpdateTag: ( label: string, id?: string) => void
}

type EditTagsModalProps = {
  show: boolean
  availableTags: Tag[]
  handleClose: () => void
  onDeleteTag: (id?: string) => void
  onUpdateTag: (label: string, id?: string ) => void
}

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      return (
        (title === "" ||
          note.Title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every(tag =>
            note.Tags.some(noteTag => noteTag.ID === tag.ID)
          ))
      )
    })
  }, [title, selectedTags, notes])

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>My Notes
            <img src={NoteImage} alt="logo" style={
              {width: "50px", height: "50px", marginLeft: "10px"}
            }/>
          </h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={selectedTags.map(tag => {
                  return { label: tag.Name, value: tag}
                })}
                options={availableTags.map(tag => {
                  return { label: tag.Name, value: tag}
                })}
                onChange={tags => {
                  setSelectedTags(
                    tags.map(tag => {
                      return tag.value
                    })
                  )
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map(note => (
          <Col key={note.ID}>
            <NoteCard {...note} availableTags={availableTags}/>
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
      />
    </>
  )
}

interface NoteCardProps extends Note {
  availableTags: Tag[]
}

function NoteCard({ ID, Title, Tags, availableTags }: NoteCardProps) {
  return (
    <Card
      as={Link}
      to={`/${ID}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{Title}</span>
          {Tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {Tags.map(tag => {
                const tagName = availableTags.find(
                  availableTag => availableTag.ID === tag.ID
                )?.Name
                if (!tagName) {
                  return null
                }
                return (
                <Badge className="text-truncate" key={tag.ID}>
                  {tagName}
                </Badge>)
              })}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {

  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    setTags(availableTags)
  }, [availableTags])

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {tags.map(tag => (
              <Row key={tag.ID}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.Name}
                    onBlur={e => {
                      const previousName = availableTags.find(
                        availableTag => availableTag.ID === tag.ID
                      )?.Name

                      if (e.target.value !== previousName) onUpdateTag(e.target.value, tag.ID)
                    }}
                    onChange={e => {
                      setTags(prevTags => {
                        return prevTags.map(prevTag => {
                          if (prevTag.ID === tag.ID) {
                            return { ...prevTag, Name: e.target.value }
                          }
                          return prevTag
                        })
                      })
                    }}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDeleteTag(tag.ID)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
