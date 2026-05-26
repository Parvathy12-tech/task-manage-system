import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import MyTask from "./MyTask";
import TaskDetails from "./TaskDetails";
import TaskHistory from "./TaskHistory";
import Profile from "./Profile";
import UserLanding from "./UserLanding";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLanding />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<MyTask />} />

        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/history" element={<TaskHistory />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/landing" element={<UserLanding />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;