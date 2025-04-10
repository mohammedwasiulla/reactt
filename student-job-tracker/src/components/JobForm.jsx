import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobContext from '../context/JobContext';
import './JobForm.css';
import JobNotifier from './JobNotifier';

const JobForm = () => {
  const { addJob, updateJob, getJob } = useContext(JobContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    link: '',
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          const job = await getJob(id);
          setFormData({
            ...job,
            applicationDate: new Date(job.applicationDate).toISOString().split('T')[0]
          });
        } catch (err) {
          setError('Could not fetch job details');
          console.error(err);
        }
      };
      
      fetchJob();
    }
  }, [isEditing, id, getJob]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.role) {
      setError('Company and Role are required fields');
      return;
    }

    try {
      if (isEditing) {
        await updateJob(id, formData);
      } else {
        await addJob(formData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save job application');
      console.error(err);
    }
  };

  return (
    <div className="job-form-container">
      <h1>{isEditing ? 'Update Job Application' : 'Add Job Application'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor="company">Company *</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="applicationDate">Application Date</label>
          <input
            type="date"
            id="applicationDate"
            name="applicationDate"
            value={formData.applicationDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="link">Job Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/job-posting"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes about this job application"
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Job' : 'Add Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;