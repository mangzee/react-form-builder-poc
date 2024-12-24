// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FormBuilder from './routes/FormBuilder';
import FormFill from './routes/FormFill';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem' }}>
        <Link to="/build" style={{ marginRight: '1rem' }}>
          Create Form
        </Link>
      </nav>

      <Routes>
        <Route path="/build" element={<FormBuilder />} />
        <Route path="/forms/:id" element={<FormFill />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;