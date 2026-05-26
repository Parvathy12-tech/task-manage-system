import { useEffect, useState, useCallback } from "react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";

function TaskDetails() {

  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // FETCH TASK
  const fetchTask = useCallback(() => {

    setLoading(true);

    fetch(`http://localhost:8000/task-detail-api/${id}/`)
      .then((res) => res.json())
      .then((data) => {

        setTask(data);
        setStatus(data.status);
        setLoading(false);

      })
      .catch((err) => {

        console.log(err);
        setLoading(false);

      });

  }, [id]);

  // FETCH COMMENTS
  const fetchComments = useCallback(() => {

    fetch(`http://localhost:8000/task-comments/${id}/`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.log(err));

  }, [id]);

  useEffect(() => {

    if (id) {
      fetchTask();
      fetchComments();
    }

  }, [id, fetchTask, fetchComments]);

  // UPDATE STATUS
  const updateStatus = () => {

    fetch(`http://localhost:8000/update-task-status/${id}/`, {

      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),

    })
      .then((res) => res.json())
      .then(() => {

        alert("Task status updated");
        fetchTask();

      })
      .catch((err) => console.log(err));

  };

  // ADD COMMENT
  const addComment = () => {

    if (!comment.trim()) return;

    fetch("http://localhost:8000/add-comment/", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        task: id,
        comment: comment,
        user: 1, // replace with logged-in user later
      }),

    })
      .then((res) => res.json())
      .then(() => {

        setComment("");
        fetchComments();

      })
      .catch((err) => console.log(err));

  };

  // LOADING
  if (loading) {
    return (
      <Layout>
        <h3>Loading...</h3>
      </Layout>
    );
  }

  // NOT FOUND
  if (!task) {
    return (
      <Layout>
        <h3>Task not found</h3>
      </Layout>
    );
  }

  return (

    <Layout>

      <div className="task-details-container">

        {/* HEADER */}
        <div className="task-header-card">

          <div>
            <h2>{task.title}</h2>
            <p className="task-description">{task.description}</p>
          </div>

          <div className="task-status-badge">
            {task.status}
          </div>

        </div>

        {/* INFO */}
        <div className="task-info-grid">

          <div className="info-card">
            <span className="info-label">Deadline</span>
            <h3>{task.deadline}</h3>
          </div>

          <div className="info-card">

            <span className="info-label">Update Status</span>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="modern-select"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <button className="modern-btn" onClick={updateStatus}>
              Update
            </button>

          </div>

        </div>

        {/* COMMENTS */}
        <div className="comments-card">

          <h3>Comments & Updates</h3>

          {/* ADD COMMENT */}
          <textarea
            placeholder="Write your update here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="modern-textarea"
          />

          <button className="modern-btn" onClick={addComment}>
            Add Comment
          </button>

          {/* COMMENT LIST */}
          <div className="comments-list">

            {comments.length === 0 ? (

              <div className="empty-comments">
                No comments yet
              </div>

            ) : (

              comments.map((c) => (

                <div className="comment-item" key={c.id}>

                  {/* AVATAR */}
                  <div className="comment-avatar">
                    {c.comment?.charAt(0).toUpperCase()}
                  </div>

                  {/* CONTENT */}
                  <div className="comment-content">

                    <p>{c.comment}</p>

                    {/* ✅ ADMIN REPLY */}
                    {c.admin_reply && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          background: "#e0f2fe",
                          borderRadius: "8px",
                          fontSize: "14px",
                          borderLeft: "3px solid #2563eb"
                        }}
                      >
                        <strong>Admin Reply:</strong> {c.admin_reply}
                      </div>
                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </Layout>

  );
}

export default TaskDetails;