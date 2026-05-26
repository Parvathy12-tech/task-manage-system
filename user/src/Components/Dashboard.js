import { useEffect, useState } from "react";
import Layout from "./Layout";
import "../styles/style.css";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const email = localStorage.getItem("email");

    console.log("Logged user email:", email);

    if (!email) {
      console.log("No email found in localStorage");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/tasks-by-user/?user=${email}`)
      .then((res) => res.json())
      .then((data) => {

        console.log("API DATA:", data);

        setTasks(data);
        setLoading(false);

      })
      .catch((err) => {

        console.log("Fetch error:", err);
        setLoading(false);

      });

  }, []);

  // COUNTS
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const progressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  return (
    <Layout>

      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Track your tasks and productivity</p>
      </div>

      {/* LOADING */}
      {loading ? (
        <h3>Loading tasks...</h3>
      ) : (
        <>
          {/* STATS */}
          <div className="stats-container">

            <div className="stats-card">
              <h3>Total Tasks</h3>
              <h1>{totalTasks}</h1>
            </div>

            <div className="stats-card">
              <h3>Completed</h3>
              <h1>{completedTasks}</h1>
            </div>

            <div className="stats-card">
              <h3>Pending</h3>
              <h1>{pendingTasks}</h1>
            </div>

            <div className="stats-card">
              <h3>In Progress</h3>
              <h1>{progressTasks}</h1>
            </div>

          </div>

          {/* TABLE */}
          <div className="dashboard-table">

            <div className="table-card">
              <h3>My Tasks</h3>

              <table>

                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>

                <tbody>

                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.status}</td>
                        <td>{task.deadline}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No tasks found</td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

    </Layout>
  );
}

export default Dashboard;