import { useEffect, useState } from "react";
import Layout from "./Layout";

function Profile() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    status: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const email = localStorage.getItem("email");

    const url =
      `http://localhost:8000/api/profile/me/?email=${email}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {

        setProfile(data);
        setLoading(false);

      })
      .catch((err) => {

        console.log(err);
        setLoading(false);

      });

  }, []);

  if (loading) {
    return (
      <Layout>
        <p>Loading Profile...</p>
      </Layout>
    );
  }

  return (

    <Layout>

      <div className="profile-container">

        <div className="profile-card">

          {/* TOP SECTION */}

          <div className="profile-top">

            <img
              src={
                profile.profile_image
                  ? `http://localhost:8000${profile.profile_image}`
                  : "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
              }
              alt="profile"
              className="profile-image"
            />

            <div className="profile-info">

              <h2>{profile.name}</h2>

              <div className="profile-tags">
{/*
  <span className="role-badge">
    <i className="bi bi-briefcase-fill"></i>
    {profile.role}
  </span> */}

</div>

              <span className="status-badge">
                {profile.status}
              </span>

            </div>

          </div>

          {/* FORM SECTION */}

          <div className="edit-form">

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                value={profile.name || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                value={profile.email || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                value={profile.phone || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <input
                type="text"
                value={profile.role || ""}
                readOnly
              />
            </div>

            <div className="form-group full-width">

              <label>Address</label>

              <textarea
                value={profile.address || ""}
                rows="4"
                readOnly
              />

            </div>

          </div>

        </div>

      </div>

    </Layout>

  );
}

export default Profile;