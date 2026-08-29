import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../utils";
import { useAuth } from "../context/AuthProvider";

function Detail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [blogs, setblogs] = useState({ comments: [] });
  const [commentText, setCommentText] = useState("");

  const fetchblogs = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(`${BACKEND_URL}/api/blogs/single-blog/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setblogs(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchblogs();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.post(
        `${BACKEND_URL}/api/blogs/${id}/comments`,
        { text: commentText },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setblogs((prev) => ({ ...prev, comments: data.comments }));
      setCommentText("");
      toast.success(data.message || "Comment added successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/blogs/${id}/comments/${commentId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setblogs((prev) => ({ ...prev, comments: data.comments }));
      toast.success(data.message || "Comment deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unable to delete comment");
    }
  };

  return (
    <div>
      <div>
        {blogs && (
          <section className="container mx-auto p-4">
            <div className="text-blue-500 uppercase text-xs font-bold mb-4">
              {blogs?.category}
            </div>
            <h1 className="text-4xl font-bold mb-6">{blogs?.title}</h1>
            <div className="flex items-center mb-6">
              <img
                src={blogs?.adminPhoto}
                alt="author_avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <p className="text-lg font-semibold">{blogs?.adminName}</p>
            </div>

            <div className="flex flex-col md:flex-row">
              {blogs?.blogImage && (
                <img
                  src={blogs?.blogImage?.url}
                  alt="mainblogsImg"
                  className="md:w-1/2 w-full h-[500px] mb-6 rounded-lg shadow-lg cursor-pointer border"
                />
              )}
              <div className="md:w-1/2 w-full md:pl-6">
                <p className="text-lg mb-6">{blogs?.about}</p>
              </div>
            </div>

            <div className="mt-10 border-t pt-6">
              <h3 className="text-2xl font-bold mb-4">
                Comments ({blogs?.comments?.length || 0})
              </h3>

              {profile && (
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Comment
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {blogs?.comments?.length > 0 ? (
                  blogs.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          {comment.photo ? (
                            <img
                              src={comment.photo}
                              alt={comment.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                              {comment.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{comment.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {(profile?.user?._id === comment.user ||
                          profile?.user?.role === "admin") && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 text-sm font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      <p className="mt-3 text-gray-700">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet. Be the first to comment.</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Detail;
