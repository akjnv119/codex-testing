import { useMemo, useState } from 'react';

const defaultTasks = [
  { id: crypto.randomUUID(), title: 'Plan your top 3 priorities', minutes: 30, done: false },
  { id: crypto.randomUUID(), title: 'Focus session', minutes: 60, done: false },
  { id: crypto.randomUUID(), title: 'Review and adjust schedule', minutes: 15, done: false },
];

export default function App() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(25);

  const stats = useMemo(() => {
    const total = tasks.reduce((sum, task) => sum + Number(task.minutes || 0), 0);
    const completed = tasks.filter((task) => task.done).length;
    const completedMinutes = tasks
      .filter((task) => task.done)
      .reduce((sum, task) => sum + Number(task.minutes || 0), 0);

    return {
      total,
      completed,
      remaining: tasks.length - completed,
      completedMinutes,
    };
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    if (!title.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        minutes: Number(minutes) || 0,
        done: false,
      },
    ]);
    setTitle('');
    setMinutes(25);
  };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <main className="container">
      <header>
        <h1>Time Management Planner</h1>
        <p>Create tasks, estimate time, and track your progress for the day.</p>
      </header>

      <section className="card stats">
        <h2>Overview</h2>
        <div className="grid">
          <div>
            <span>Total tasks</span>
            <strong>{tasks.length}</strong>
          </div>
          <div>
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
          <div>
            <span>Remaining</span>
            <strong>{stats.remaining}</strong>
          </div>
          <div>
            <span>Planned minutes</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span>Completed minutes</span>
            <strong>{stats.completedMinutes}</strong>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Add Task</h2>
        <form onSubmit={addTask} className="task-form">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            aria-label="Task title"
          />
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            placeholder="Minutes"
            aria-label="Task minutes"
          />
          <button type="submit">Add</button>
        </form>
      </section>

      <section className="card">
        <h2>Task List</h2>
        <ul className="tasks">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                <span>{task.title}</span>
              </label>
              <div className="actions">
                <small>{task.minutes} min</small>
                <button type="button" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
