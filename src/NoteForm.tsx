import { FormEvent, useRef, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
import { Note, Tag } from "./App"
import { v4 as uuidV4 } from "uuid"

type NoteFormProps = {
  onSubmit: (data: Note) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<Note>

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  Title = "",
  Body = "",
  Tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(Tags)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    onSubmit({
      ID: uuidV4(),
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
                  const newTag = { ID: uuidV4(), Name: label }
                  onAddTag(newTag)
                  setSelectedTags(prev => [...prev, newTag])
                }}
                value={selectedTags.map(tag => {
                  return { label: tag.Name, value: tag.ID }
                })}
                options={availableTags.map(tag => {
                  return { label: tag.Name, value: tag.ID }
                })}
                onChange={tags => {
                  setSelectedTags(
                    tags.map(tag => {
                      return { Name: tag.label, ID: tag.value }
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
