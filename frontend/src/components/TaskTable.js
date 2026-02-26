import React from 'react';
import './TaskTable.css';

function TaskTable({ tasks, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="table-wrapper">
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create one to get started!</p>
        </div>
      ) : (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>TASKS</th>
                <th>DEADLINE</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.task_name}</td>
                  <td>{task.task_description || '-'}</td>
                  <td>{formatDate(task.deadline)}</td>
                </tr>
              ))}
            </tbody>
          </table>
      )}
    </div>
  );
}

export default TaskTable;
