import React from 'react';
import './TaskTable.css';

function AssignmentTable({ assignments, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'submitted':
        return 'status-submitted';
      case 'not_submitted':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case 'not_submitted':
        return 'Not Submitted';
      case 'submitted':
        return 'Submitted';
      default:
        return status;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      case 'medium':
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className="table-wrapper">
      {assignments.length === 0 ? (
        <div className="empty-state">
          <p>No assignments yet. Create one to get started!</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>COURSE</th>
              <th>ASSIGNMENT</th>
              <th>SUBJECT</th>
              <th>DUE DATE</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.course}</td>
                <td>{assignment.assignment_title}</td>
                <td>{assignment.subject || '-'}</td>
                <td>{formatDate(assignment.due_date)}</td>
                <td>
                  <span className={`badge ${getPriorityBadgeClass(assignment.priority)}`}>
                    {assignment.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(assignment.submission_status)}`}>
                    {getStatusDisplayText(assignment.submission_status)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => onDelete(assignment.id)}
                    className="btn-delete"
                    title="Delete assignment"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AssignmentTable;
