import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

function MyTask() {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {

    const email = localStorage.getItem("email");

    fetch(`http://127.0.0.1:8000/tasks-by-user/?user=${email}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));

  }, []);

  const filteredTasks = tasks.filter((task) => {

    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All Status" || task.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <Layout>

      <div className="page-top">
        <h2>My Tasks</h2>

        <div className="search-filter">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>In Progress</option>
          </select>

        </div>
      </div>

      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>Task</th>
              
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}   // ✅ FIXED
                  style={{ cursor: "pointer" }}
                >

                  <td>{task.title}</td>

                  

                  <td>{task.deadline}</td>

                  <td>
                    <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No tasks found</td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </Layout>
  );
}

export default MyTask;