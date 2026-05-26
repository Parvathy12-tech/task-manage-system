import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("email");

    navigate("/");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    console.log("Searching:", e.target.value);
  };

  return (
    <div className="navbar">

      {/* LEFT SIDE */}
      <div className="nav-left">
        <h3 className="logo">TaskFlow</h3>
      </div>

      {/* CENTER SEARCH */}
      <div className="nav-center">

        <input
          type="text"
          placeholder="Search tasks, users..."
          className="nav-search"
          value={search}
          onChange={handleSearch}
        />

        <i className="fa-solid fa-magnifying-glass search-icon"></i>

      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        

        <div
          className="logout-icon"
          onClick={handleLogout}
          title="Logout"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </div>

      </div>

    </div>
  );
}

export default Navbar;