import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './layouts/LandingLayout';
import "./styles/landing.css";
import AppRoutes from './routes/AppRoutes';
function App() {
  return (
        <AppRoutes />
  );
}

export default App;