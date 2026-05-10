import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AssignmentTable from '../components/AssignmentTable';
import CreateAssignmentModal from '../components/CreateAssignmentModal';
import './DashboardPage.css';

function DashboardPage({ user, onLogout }) {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/assignments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(response.data.assignments || []);
    } catch (err) {
      setError('Error fetching assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const response = await axios.post('/api/assignments', assignmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments([...assignments, response.data.assignment]);
      setShowModal(false);
    } catch (err) {
      setError('Error creating assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(`/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(assignments.filter((assignment) => assignment.id !== assignmentId));
    } catch (err) {
      setError('Error deleting assignment');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.username || 'Student'}</h1>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="sidebar-label">MANAGE ASSIGNMENTS</div>
          <button onClick={() => setShowModal(true)} className="btn-primary create-btn">
            CREATE
          </button>
        </div>

        <div className="dashboard-main">
          <div className="assignments-section">
            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <AssignmentTable assignments={assignments} onDelete={handleDeleteAssignment} />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateAssignmentModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateAssignment}
        />
      )}
    </div>
  );
}

export default DashboardPage;
