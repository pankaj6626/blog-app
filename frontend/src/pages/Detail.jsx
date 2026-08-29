import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { BACKEND_URL } from "../../utils";

function Detail() {
  const { id } = useParams();
  const { profile } = useAuth();
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");

  const token = localStorage.getItem("jwt");
  const currentUser = profile?.user || profile;

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/blogs/single-blog/${id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setBlog(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unable to load blog");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
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

      setBlog((prev) => ({ ...prev, comments: data.comments }));
      setCommentText("");
      toast.success(data.message || "Comment added successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong while adding comment"
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/blogs/${id}/comments/${commentId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setBlog((prev) => ({ ...prev, comments: data.comments }));
      toast.success(data.message || "Comment deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Unable to delete comment"
      );
    }
  };

  if (!blog) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <section className="container mx-auto p-4">
        <div className="text-blue-500 uppercase text-xs font-bold mb-4">
          {blog?.category}
        </div>
        <h1 className="text-4xl font-bold mb-6">{blog?.title}</h1>

        <div className="flex items-center mb-6">
          <img
            src={blog?.adminPhoto}
            alt="author_avatar"
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <p className="text-lg font-semibold">{blog?.adminName}</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {blog?.blogImage && (
            <img
              src={blog?.blogImage?.url}
              alt="mainblogsImg"
              className="md:w-1/2 w-full h-[500px] mb-6 rounded-lg shadow-lg object-cover border"
            />
          )}
          <div className="md:w-1/2 w-full md:pl-6">
            <p className="text-lg mb-6">{blog?.about}</p>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <h3 className="text-2xl font-bold mb-4">
            Comments ({blog?.comments?.length || 0})
          </h3>

          {currentUser && (
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
            {blog?.comments?.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment._id} className="border rounded-lg p-4 bg-gray-50">
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
                          {comment.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{comment.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {(
                      String(comment.user) === String(currentUser?._id) ||
                      currentUser?.role === "admin"
                    ) && (
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
              <p className="text-gray-500">
                No comments yet. Be the first to comment.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Detail;
