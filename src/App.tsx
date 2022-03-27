import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './components';
import { HomePage } from './container';

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
