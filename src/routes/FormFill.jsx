// src/routes/FormFill.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function FormFill() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [fileUploads, setFileUploads] = useState({});

  useEffect(() => {
    // In a real app, we'd GET /api/forms/:id
    // For now, mock some form schema:
    const mockForm = {
      id,
      schema: {
        title: 'Mock Form Title',
        fields: [
          { id: 'q1', type: 'text', label: 'Your Name' },
          { id: 'q2', type: 'select', label: 'Favorite Color', options: ['Red', 'Green', 'Blue'] },
          { id: 'q3', type: 'file', label: 'Upload a File' },
        ],
      },
    };
    setForm(mockForm);
  }, [id]);

  const handleFileChange = (questionId, file) => {
    setFileUploads((prev) => ({ ...prev, [questionId]: file }));
  };

  const handleSubmit = async () => {
    let finalAnswers = { ...answers };

    // For each file, upload to .NET which pushes to Azure
    for (const [qId, file] of Object.entries(fileUploads)) {
      if (!file) continue;
      const uploadedUrl = await mockUploadToAzure(file);
      finalAnswers[qId] = uploadedUrl;
    }

    // Then POST finalAnswers to /api/forms/:id/responses
    console.log('Submitting to backend:', finalAnswers);
    alert('Form submitted!');
    setAnswers({});
    setFileUploads({});
  };

  // Mock function to show concept of uploading to Azure
  const mockUploadToAzure = async (file) => {
    // In reality, you'd do something like:
    // let formData = new FormData();
    // formData.append('file', file);
    // const res = await fetch('http://localhost:5000/api/uploads', { method: 'POST', body: formData });
    // const data = await res.json();
    // return data.fileUrl;
    return Promise.resolve('https://fakeazure.blob.core.windows.net/.../' + file.name);
  };

  if (!form) return <div>Loading form...</div>;

  const { schema } = form;
  return (
    <div style={{ margin: '2rem' }}>
      <h1>{schema.title}</h1>
      {schema.fields.map((field) => {
        const qId = field.id;
        switch (field.type) {
          case 'text':
            return (
              <div key={qId} style={{ marginBottom: '1rem' }}>
                <label>{field.label}</label><br />
                <input
                  type="text"
                  value={answers[qId] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [qId]: e.target.value }))
                  }
                />
              </div>
            );
          case 'textarea':
            return (
              <div key={qId} style={{ marginBottom: '1rem' }}>
                <label>{field.label}</label><br />
                <textarea
                  rows="4"
                  value={answers[qId] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [qId]: e.target.value }))
                  }
                />
              </div>
            );
          case 'select':
            return (
              <div key={qId} style={{ marginBottom: '1rem' }}>
                <label>{field.label}</label><br />
                <select
                  value={answers[qId] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [qId]: e.target.value }))
                  }
                >
                  <option value="">--Select--</option>
                  {(field.options || []).map((opt, idx) => (
                    <option key={idx} value={opt.trim()}>
                      {opt.trim()}
                    </option>
                  ))}
                </select>
              </div>
            );
          case 'file':
            return (
              <div key={qId} style={{ marginBottom: '1rem' }}>
                <label>{field.label}</label><br />
                <input
                  type="file"
                  onChange={(e) => handleFileChange(qId, e.target.files[0])}
                />
              </div>
            );
          default:
            return null;
        }
      })}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default FormFill;
