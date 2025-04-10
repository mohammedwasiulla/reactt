import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import { JobProvider } from './context/JobContext';
import './App.css';

function App() {
  return (
    <JobProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<JobList />} />
              <Route path="/add" element={<JobForm />} />
              <Route path="/edit/:id" element={<JobForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </JobProvider>
  );
}

export default App;