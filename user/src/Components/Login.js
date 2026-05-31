import "./UserLogin.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          username: email.trim(),
          password: password
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const user = response.data.user;

      if (!user) {
        alert("Login failed: No user data received");
        return;
      }

      // ✅ Save login state
      localStorage.setItem("userToken", "loggedin");
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("email", user.email);

      alert(response.data.message || "Login Successful");

      // redirect
      navigate("/dashboard");

    } catch (error) {

      console.log("LOGIN ERROR:", error.response?.data);

      if (error.response) {
        alert(error.response.data.error || "Login Failed");
      } else {
        alert("Server Error");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">

      <div className="user-login-container">

        <h2 >User Login</h2>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="user-input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="user-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button type="submit" className="modern-button" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>

        </form>

      </div>
    </div>
  );
}

export default UserLogin;