// src/routes/FormBuilder.jsx
import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

//
// Available question types (including "file")
//
const questionTypes = [
  { type: 'text', label: 'Short Text' },
  { type: 'textarea', label: 'Long Text' },
  { type: 'select', label: 'Multiple Choice' },
  { type: 'file', label: 'File Upload' },
];

//
// The main FormBuilder component
//
function FormBuilder() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);

  // Add a new field of the chosen type
  const handleAddField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type,
        label: `Untitled ${type} question`,
        // If it's a 'select' type, we keep an options array. Otherwise undefined.
        options: type === 'select' ? [] : undefined,
      },
    ]);
  };

  // Reordering logic with dnd-kit
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      setFields((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  //
  // Each item in the list is "sortable." This is the component for rendering each field.
  //
  function SortableItem({ field }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: field.id });

    // Inline styles for the drag movement/animation
    const style = {
      transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
      transition,
      padding: '8px',
      border: '1px solid #ccc',
      marginBottom: '8px',
      background: '#fff',
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {/* A text input to edit the question LABEL */}
        <input
          type="text"
          value={field.label}
          onChange={(e) => {
            const val = e.target.value;
            setFields((prev) =>
              prev.map((f) => (f.id === field.id ? { ...f, label: val } : f))
            );
          }}
          style={{ display: 'block', marginBottom: '8px', width: '100%' }}
        />

        {/* If it's a SELECT type, show a textarea for options */}
        {field.type === 'select' && (
          <textarea
            placeholder="Comma-separated options..."
            value={(field.options || []).join(',')}
            onChange={(e) => {
              const opts = e.target.value.split(',');
              setFields((prev) =>
                prev.map((f) => (f.id === field.id ? { ...f, options: opts } : f))
              );
            }}
            style={{ display: 'block', marginBottom: '8px', width: '100%' }}
          />
        )}

        {/* If it's a FILE type, optionally show a disabled file input or a placeholder */}
        {field.type === 'file' && (
          <div style={{ marginBottom: '8px' }}>
            <p style={{ margin: '0 0 4px' }}>
              This is a "File Upload" question. (Preview only)
            </p>
            <input type="file" disabled style={{ opacity: 0.7 }} />
          </div>
        )}

        {/* Delete button to remove the field */}
        <button
          style={{ color: 'red' }}
          onClick={() => setFields((prev) => prev.filter((q) => q.id !== field.id))}
        >
          Delete
        </button>
      </div>
    );
  }

  // Save form to your backend (placeholder)
  const handleSave = async () => {
    const formSchema = { title, fields };

    // Typically you'd POST to .NET or store in a DB. For demo, just log it.
    console.log('Saving form schema:', formSchema);

    // You might get an ID back from the backend; we mock it here:
    const mockId = uuidv4();
    alert(`Form saved! Link: http://localhost:3000/forms/${mockId}`);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
      {/* Toolbox */}
      <div>
        <h2>Form Title</h2>
        <input
          style={{ display: 'block', marginBottom: '1rem' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h3>Add Question Types</h3>
        {questionTypes.map((qt) => (
          <button
            key={qt.type}
            onClick={() => handleAddField(qt.type)}
            style={{ display: 'block', margin: '4px 0' }}
          >
            {qt.label}
          </button>
        ))}
        <button onClick={handleSave} style={{ marginTop: '1rem' }}>
          Save Form
        </button>
      </div>

      {/* Form Canvas (drag-and-drop area) */}
      <div style={{ flex: 1 }}>
        <h2>Form Canvas</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <SortableItem key={field.id} field={field} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default FormBuilder;
