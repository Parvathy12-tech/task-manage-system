import "./Landing.css";

function UserLanding() {
  return (
    <div>

      {/* NAVBAR */}

      <nav>

        <div className="logo">
          TaskFlow
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#contact">Contact</a>

          <a href="/login" className="login-btn">
            User Login
          </a>

        </div>

      </nav>

      {/* HERO */}

      <section className="hero" id="home">

        <div className="hero-content">

          <h1>
            Manage Your <span>Tasks</span><br />
            With Simplicity
          </h1>

          <p>
            Stay organized, track deadlines, update task progress
            and collaborate efficiently using a modern task
            management platform designed for productivity.
          </p>

          <div className="hero-buttons">

            <a href="/login" className="btn-primary">
              Get Started
            </a>

            <a href="#features" className="btn-secondary">
              Explore Features
            </a>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="features" id="features">

        <div className="section-title">

          <h2>User Features</h2>

          <p>
            Everything users need to manage and track assigned tasks.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              ✅
            </div>

            <h3>Task Tracking</h3>

            <p>
              View assigned tasks, deadlines and task statuses
              in a clean and organized dashboard.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📝
            </div>

            <h3>Status Updates</h3>

            <p>
              Update task progress, mark tasks as completed
              and add comments or work updates.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>Task History</h3>

            <p>
              Access completed task history and search
              through previous task activities.
            </p>

          </div>

        </div>

      </section>

      {/* WORKFLOW */}

      <section className="workflow" id="workflow">

        <div className="section-title">

          <h2>How It Works</h2>

          <p>
            Simple workflow designed for productivity.
          </p>

        </div>

        <div className="workflow-grid">

          <div className="workflow-card">

            <h1>1</h1>

            <h3>Login</h3>

            <p>
              Securely login using your credentials provided by the administrator.
            </p>

          </div>

          <div className="workflow-card">

            <h1>2</h1>

            <h3>Manage Tasks</h3>

            <p>
              View assigned tasks, deadlines and update task progress easily.
            </p>

          </div>

          <div className="workflow-card">

            <h1>3</h1>

            <h3>Track Progress</h3>

            <p>
              Monitor completed tasks and maintain productivity efficiently.
            </p>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer id="contact">

        <p>
          © 2026 TaskFlow User Portal. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default UserLanding;