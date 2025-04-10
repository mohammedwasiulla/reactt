import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = "https://student-job-backend-ob10.onrender.com/api/jobs";


  // Utility: show a message for a few seconds
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000); // Clear after 3 seconds
  };

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setLoading(false);
    }
  };

  // Add a new job
  const addJob = async (job) => {
    try {
      const response = await axios.post(API_URL, job);
      setJobs([response.data, ...jobs]);
      showMessage('Job added');
      return response.data;
    } catch (err) {
      setError('Failed to add job');
      throw err;
    }
  };

  // Update a job
  const updateJob = async (id, job) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, job);
      setJobs(jobs.map(j => j._id === id ? response.data : j));
      showMessage('Job updated');
      return response.data;
    } catch (err) {
      setError('Failed to update job');
      throw err;
    }
  };

  // Delete a job
  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
      showMessage('Job deleted');
    } catch (err) {
      setError('Failed to delete job');
      throw err;
    }
  };

  // Get a single job
  const getJob = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError('Failed to get job');
      throw err;
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        message,
        fetchJobs,
        addJob,
        updateJob,
        deleteJob,
        getJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
