// src/App.jsx

import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // No BrowserRouter here
import Header from "./components/Header";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/AddProjectForm";
import AuthForm from "./components/Auth";
import ProjectDetail from "./components/ProjectDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // ✅ Add users state here

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);

    const storedParticipants =
      JSON.parse(localStorage.getItem("participants")) || [];
    setParticipants(storedParticipants);

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers); // ✅ Load users from localStorage

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // ... (rest of your functions)

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative overflow-hidden">
      <div className="fixed w-full z-50 top-0">
        <Header user={user} onLogout={handleLogout} />
      </div>
      <main className="flex-1 container mx-auto px-4 py-8 mt-20 relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <ProjectList
                projects={projects}
                participants={participants}
                handleDeleteParticipant={handleDeleteParticipant}
                handleClearParticipants={handleClearParticipants}
                handleJoin={handleJoin}
                handleEdit={handleEdit}
                handleDeleteProject={handleDeleteProject}
                user={user}
                users={users} // ✅ Pass users as a prop
              />
            }
          />
          <Route
            path="/add-project"
            element={
              <ProjectForm onSubmit={handleAddProject} user={user} type="add" />
            }
          />
          <Route
            path="/edit-project/:projectId"
            element={
              <ProjectForm
                onSubmit={handleEdit}
                user={user}
                projects={projects}
                type="edit"
              />
            }
          />
          <Route path="/auth" element={<AuthForm onLogin={handleLogin} />} />
          <Route
            path="/project/:projectId"
            element={
              <ProjectDetail
                projects={projects}
                participants={participants}
                handleDeleteParticipant={handleDeleteParticipant}
                handleClearParticipants={handleClearParticipants}
                handleJoin={handleJoin}
                handleEdit={handleEdit}
                handleDeleteProject={handleDeleteProject}
                user={user}
                users={users} // ✅ Pass users here as well
              />
            }
          />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
