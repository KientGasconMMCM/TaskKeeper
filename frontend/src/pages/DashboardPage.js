import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskTable from '../components/TaskTable';
import CreateTaskModal from '../components/CreateTaskModal';
import './DashboardPage.css';

function DashboardPage({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data.task]);
      setShowModal(false);
    } catch (err) {
      setError('Error creating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError('Error deleting task');
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
          <h1>Welcome User,</h1>
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
              <TaskTable tasks={tasks} onDelete={handleDeleteTask} />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
}

export default DashboardPage;
