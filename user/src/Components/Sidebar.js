import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar() {

  const [user, setUser] = useState({
    name: "",
    role: "",
    profile_image: "",
  });

  useEffect(() => {

    // ✅ GET EMAIL FROM LOCAL STORAGE
    const email = localStorage.getItem("email");

    // ✅ FETCH PROFILE DATA
    fetch(`http://localhost:8000/api/profile/me/?email=${email}`)
      .then((res) => res.json())
      .then((data) => {

        setUser({
          name: data.name,
          role: data.role,
          profile_image: data.profile_image,
        });

      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (

    <div className="sidebar">

      {/* PROFILE */}

      <div className="sidebar-profile">

        <img
          src={
            user.profile_image
              ? `http://localhost:8000${user.profile_image}`
              : "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
          }
          alt="profile"
        />

        <h3>{user.name}</h3>

        <p>{user.role}</p>

      </div>

      {/* MENU */}

      <div className="menu">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/tasks">
          My Tasks
        </Link>

        <Link to="/history">
          Task History
        </Link>

        <Link to="/profile">
          Profile
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;