import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { generateAvatarUrl } from "../utils/avatarUtils";

// Helper functions for localStorage
const getProjectsFromLocalStorage = () => {
  const projects = localStorage.getItem("projects");
  return projects ? JSON.parse(projects) : [];
};

const getUsersFromLocalStorage = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const ProfilePage = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const allUsers = getUsersFromLocalStorage();
    const foundUser = allUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    setProfileUser(foundUser);

    if (foundUser) {
      const allProjects = getProjectsFromLocalStorage();
      const projectsOfUser = allProjects.filter(
        (p) => p.userId === foundUser.id
      );
      setUserProjects(projectsOfUser);
    }
  }, [username]);

  if (!profileUser) {
    return (
      <div className="text-center text-xl text-gray-500 dark:text-gray-400">
        Kullanıcı bulunamadı.
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Planlama":
        return "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      case "Devam Ediyor":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      case "Tamamlandı":
        return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={generateAvatarUrl(profileUser.username, "")}
          alt={`${profileUser.username} Avatar`}
          className="w-32 h-32 rounded-full mb-4 border-4 border-green-500 shadow-lg"
        />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {profileUser.username}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Toplam {userProjects.length} proje oluşturdu.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2">
        Oluşturulan Projeler
      </h2>

      {userProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <Link to={`/project/${project.id}`}>
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:underline">
                  {project.title}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status || "Durum Yok"}
                </span>
                {project.tags &&
                  project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Bu kullanıcının henüz bir projesi yok.
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
