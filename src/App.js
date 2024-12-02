import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";  
import Registration from './components/Registration';
import Login from './components/Login';
import ToDoList from './components/ToDoList';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/register" />} />

        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<ProtectedRoute element={ToDoList} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
