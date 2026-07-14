'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';

export default function TaskQueue({ tasks }) {
  const [showCompleted, setShowCompleted] = useState(false);

  // Group tasks by status
  const activeTasks = tasks.filter((t) => t.status === 'accepted');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="volunteer-task-queue" role="list">
      {/* Active (accepted) tasks — always at top */}
      {activeTasks.length > 0 && (
        <section className="volunteer-task-group">
          <div className="volunteer-task-group-header">
            <span className="volunteer-task-group-title">Active</span>
            <span className="volunteer-task-group-count active">
              {activeTasks.length}
            </span>
          </div>
          <div className="volunteer-task-group-list">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Pending (new) tasks */}
      {pendingTasks.length > 0 && (
        <section className="volunteer-task-group">
          <div className="volunteer-task-group-header">
            <span className="volunteer-task-group-title">Pending</span>
            <span className="volunteer-task-group-count pending">
              {pendingTasks.length}
            </span>
          </div>
          <div className="volunteer-task-group-list">
            {pendingTasks
              .sort(
                (a, b) =>
                  new Date(b.receivedAt).getTime() -
                  new Date(a.receivedAt).getTime()
              )
              .map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}
          </div>
        </section>
      )}

      {/* Completed tasks — collapsible */}
      {completedTasks.length > 0 && (
        <section className="volunteer-task-group">
          <div className="volunteer-task-group-header">
            <span className="volunteer-task-group-title">Completed</span>
            <span className="volunteer-task-group-count completed">
              {completedTasks.length}
            </span>
            <button
              className="volunteer-task-group-toggle"
              onClick={() => setShowCompleted(!showCompleted)}
              aria-expanded={showCompleted}
              aria-label={
                showCompleted
                  ? 'Hide completed tasks'
                  : 'Show completed tasks'
              }
            >
              {showCompleted ? 'Hide' : 'Show'}
              <span
                className={`volunteer-task-group-toggle-icon ${
                  showCompleted ? 'expanded' : ''
                }`}
              >
                ▼
              </span>
            </button>
          </div>
          {showCompleted && (
            <div className="volunteer-task-group-list">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
