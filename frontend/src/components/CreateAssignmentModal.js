import React, { useState } from 'react';
import './CreateTaskModal.css';

function CreateAssignmentModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    course: '',
    assignmentTitle: '',
    dueDate: '',
    subject: '',
    priority: 'medium',
    submissionStatus: 'pending',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.course.trim() || !formData.assignmentTitle.trim()) {
      setError('Course and assignment title are required');
      return;
    }

    setLoading(true);

    try {
      await onCreate(formData);
      setFormData({
        course: '',
        assignmentTitle: '',
        dueDate: '',
        subject: '',
        priority: 'medium',
        submissionStatus: 'pending',
        description: '',
      });
    } catch (err) {
      setError('Error creating assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Assignment</h2>
        </div>

        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g., Biology 101"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignmentTitle">Assignment Title</label>
              <input
                type="text"
                id="assignmentTitle"
                name="assignmentTitle"
                value={formData.assignmentTitle}
                onChange={handleChange}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject/Topic</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Cell Biology"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="submissionStatus">Status</label>
              <select
                id="submissionStatus"
                name="submissionStatus"
                value={formData.submissionStatus}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter assignment description or notes"
                rows="4"
              ></textarea>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAssignmentModal;
