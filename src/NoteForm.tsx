import { FormEvent, useRef, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
import { Note, NoteWithoutID, Tag, TagWithoutID } from "./App"

type NoteFormProps = {
  onSubmit: (data: NoteWithoutID) => void
  availableTags: Tag[]
} & Partial<Note>

export function NoteForm({
  onSubmit,
  availableTags,
  Title = "",
  Body = "",
  Tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<TagWithoutID[]>(Tags)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    onSubmit({
      Title: titleRef.current!.value,
      Body: markdownRef.current!.value,
      Tags: selectedTags,
    })

    navigate("..")
  }

  console.log({ selectedTags })

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={Title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={label => {
                  const newTag = { Name: label }
                  setSelectedTags(prev => [...prev, newTag])
                }}
                value={selectedTags.map(tag => {
                  return { label: tag.Name }
                })}
                options={availableTags.map(tag => {
                  return { label: tag.Name }
                })}
                onChange={tags => {
                  setSelectedTags(
                    tags.map(tag => {
                      return { Name: tag.label }
                    })
                  )
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={Body}
            required
            as="textarea"
            ref={markdownRef}
            rows={15}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}
