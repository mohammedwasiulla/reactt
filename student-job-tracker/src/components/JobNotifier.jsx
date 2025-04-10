// JobNotifier.js
import React, { useContext } from 'react';
import JobContext from '../context/JobContext';
const JobNotifier = () => {
  const { message } = useContext(JobContext);

  return message ? (
    <div style={{
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px 15px',
      margin: '10px 0',
      borderRadius: '5px',
      border: '1px solid #c3e6cb'
    }}>
      {message}
    </div>
  ) : null;
};

export default JobNotifier;
