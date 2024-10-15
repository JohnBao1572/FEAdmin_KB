import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import { Router } from 'react-router-dom';
import Routers from './routers/Routers';

function App() {
  return (
    <Routers />
  );
}

export default App;
