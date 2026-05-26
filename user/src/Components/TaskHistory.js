import { useEffect, useState, useMemo } from "react";
import Layout from "./Layout";

function TaskHistory() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH FROM DATABASE
  useEffect(() => {
    fetch("http://localhost:8000/api/tasks/completed/")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);
        console.log("FIRST TASK:", data[0]);

        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // 📅 WEEK FILTER
  const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return date >= startOfWeek;
  };

  // 📅 MONTH FILTER
  const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  // 🔍 FILTER + SEARCH
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      let matchFilter = true;

      // IMPORTANT: using deadline (from your API)
      if (filter === "This Week") {
        matchFilter = isThisWeek(task.deadline);
      }

      if (filter === "This Month") {
        matchFilter = isThisMonth(task.deadline);
      }

      return matchSearch && matchFilter;
    });
  }, [tasks, search, filter]);

  return (
    <Layout>
      <h2>Task History</h2>

      {/* SEARCH + FILTER */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search Completed Tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Completed Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>

                  {/* DATE FIXED (deadline from API) */}
                  <td>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{task.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default TaskHistory;