import React, { useState } from 'react'
import buildServices from './utils/services'
import './App.css';
import Dashboard from './components/Dashboard'
import { useSafe } from './utils/SafeProvider'

function App() {
  const [services] = useState(buildServices(useSafe()));
  return <Dashboard services={services} />

}

export default App;
