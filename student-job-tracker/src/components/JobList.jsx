import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import JobContext from '../context/JobContext';
import { format } from 'date-fns';
import './JobList.css';
import JobNotifier from './JobNotifier';

const JobList = () => {
  const { jobs, loading, error, deleteJob, message } = useContext(JobContext);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // ✅ Ensure jobs is always an array before using .filter
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
        const matchesSearch =
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : [];

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await deleteJob(id);
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied':
        return 'status-applied';
      case 'Interview':
        return 'status-interview';
      case 'Offer':
        return 'status-offer';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h1>My Job Applications</h1>
        <Link to="/add" className="btn-primary add-job-btn">
          Add New Application
        </Link>
      </div>

      {/* ✅ Show notification if available */}
      {message && <JobNotifier message={message} />}

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <label>Filter by Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <p>No job applications found.</p>
        </div>
      ) : (
        <div className="job-cards">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-card-header">
                <h2>{job.company}</h2>
                <span className={`status-badge ${getStatusClass(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-card-body">
                <h3>{job.role}</h3>
                <p className="job-date">
                  Applied on: {format(new Date(job.applicationDate), 'MMM dd, yyyy')}
                </p>

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-link"
                  >
                    View Job Posting
                  </a>
                )}

                {job.notes && (
                  <div className="job-notes">
                    <p>
                      <strong>Notes:</strong> {job.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="job-card-actions">
                <Link to={`/edit/${job._id}`} className="btn-secondary">
                  Edit
                </Link>
                <button className="btn-danger" onClick={() => handleDeleteJob(job._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
