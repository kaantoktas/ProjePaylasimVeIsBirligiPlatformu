import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { generateAvatarUrl } from "../utils/avatarUtils";

const ProjectDetail = ({
  projects,
  participants,
  user,
  users,
  handleJoin,
  handleAddComment,
  handleDeleteParticipant,
  handleDeleteProject,
}) => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === parseInt(id));
  const [commentText, setCommentText] = useState("");

  if (!project) {
    return (
      <div className="text-center mt-10 text-white">
        Proje bulunamadı.
        <br />
        <Link to="/" className="text-purple-400 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Sadece ana katılımcıları (yorum olmayanları) filtreliyoruz
  const projectParticipants = participants.filter(
    (p) => p.projectId === project.id && !p.parentId
  );

  // Tüm yorumları (ana ve alt yorumlar) filtreliyoruz
  const projectComments = participants.filter(
    (p) => p.projectId === project.id
  );

  const isUserOwner = user && user.id === project.userId;
  const isUserJoined =
    user && projectParticipants.some((p) => p.userId === user.id);

  // handleJoin fonksiyonunu doğru parametrelerle çağırıyoruz
  const handleJoinClick = () => {
    if (user) {
      // commentData ve parentId parametrelerini doğru formatta gönderiyoruz
      handleJoin(project.id, { comment: null }, null);
    } else {
      alert("Projeye katılmak için giriş yapmalısınız.");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (user && commentText.trim()) {
      handleAddComment(project.id, commentText);
      setCommentText("");
    } else if (!user) {
      alert("Yorum yapmak için giriş yapmalısınız.");
    } else {
      alert("Yorum alanı boş bırakılamaz.");
    }
  };

  const projectOwner = users.find((u) => u.id === project.userId);
  const getNestedComments = (commentList, parentId = null) => {
    const nestedComments = commentList.filter(
      (comment) => comment.parentId === parentId
    );
    return nestedComments.map((comment) => ({
      ...comment,
      replies: getNestedComments(commentList, comment.id),
    }));
  };
  const commentTree = getNestedComments(
    projectComments.filter((p) => p.comment)
  );

  const renderComments = (comments) => {
    return (
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="animate-slide-up">
            <div
              className={`relative bg-white/10 backdrop-blur-md border border-pink-400/20 p-4 rounded-xl shadow-lg text-sm text-gray-100 transition-colors duration-300 ${
                comment.parentId ? "ml-6" : ""
              }`}
            >
              <div className="flex items-center mb-2">
                <img
                  src={generateAvatarUrl(comment.name, comment.surname)}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex-1">
                  <strong className="block text-purple-200">
                    {comment.name} {comment.surname}
                  </strong>
                  {comment.comment && (
                    <p className="text-gray-200 italic">"{comment.comment}"</p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          {user && !isUserJoined && !isUserOwner && (
            <button
              onClick={handleJoinClick}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Projeye Katıl
            </button>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <span className="mr-2">Oluşturan:</span>
          <Link
            to={`/profile/${projectOwner?.username}`}
            className="hover:underline"
          >
            {projectOwner?.username || "Bilinmiyor"}
          </Link>
          <span className="mx-2">•</span>
          <span>{project.status}</span>
        </div>
        <p className="text-gray-300 mb-6">{project.description}</p>

        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto object-cover rounded-lg mb-6"
          />
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Katılımcılar</h3>
          <ul className="list-disc list-inside text-gray-300">
            {projectParticipants.length > 0 ? (
              projectParticipants.map((p) => (
                <li key={p.id}>
                  <img
                    src={generateAvatarUrl(p.name, p.surname)}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full inline-block mr-2"
                  />
                  {p.name} {p.surname}
                </li>
              ))
            ) : (
              <li>Henüz katılımcı yok.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-4">Yorumlar</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Yorumunuzu buraya yazın..."
              rows="4"
            />
            <button
              type="submit"
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Yorum Yap
            </button>
          </form>
        ) : (
          <p className="text-gray-400 mb-6">
            Yorum yapmak için giriş yapmalısınız.
          </p>
        )}

        <div>
          {commentTree.length > 0 ? (
            renderComments(commentTree)
          ) : (
            <p className="text-gray-400">Henüz yorum yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
