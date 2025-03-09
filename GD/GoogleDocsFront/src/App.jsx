import React from 'react';
import Editor from "./Components/editor";
import './App.css'; // Uncomment this if you have CSS to import

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Now, we are importing the uuid
import { v4 as uuid } from 'uuid'

function App() {
  return (
    <Router>
      <Routes>
        {/* Now, we have to generate a ID */}
        <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`} />} />
        {/* It will open the page after generating the ID. */}
        <Route path='/docs/:id' element={<Editor />} />
      </Routes>
    </Router >
  );
}

export default App;
