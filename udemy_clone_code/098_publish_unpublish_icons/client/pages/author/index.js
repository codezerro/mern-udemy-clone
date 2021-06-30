import { useEffect, useState } from "react";
import axios from "axios";
import AuthorRoute from "../../components/routes/AuthorRoute";
import Link from "next/link";
import { Avatar, Tooltip } from "antd";
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const AuthorIndex = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPostsByAuthor();
  }, []);

  const loadPostsByAuthor = async () => {
    const { data } = await axios.get("/api/posts-by-author");
    setPosts(data);
  };

  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/api/post/${post._id}`);
      loadPostsByAuthor();
      toast("Post deleted!");
    } catch (err) {
      toast("Error deleting! Try again.");
    }
  };

  const handlePublish = async (post) => {
    // console.log("handlePublish", post);
    // return;
    try {
      let answer = window.confirm("Are you sure you want to publish?");
      if (!answer) return;
      const { data } = await axios.put(`/api/post/publish/${post._id}`);
      // console.log("COURSE PUBLISHED RES", data);
      toast("Congrats. Your post live published!");
      loadPostsByAuthor();
    } catch (err) {
      toast("Post publish failed. Try again");
    }
  };

  const handleUnpublish = async (post) => {
    // console.log("handleUnpublish", post);
    // return;
    try {
      let answer = window.confirm("Are you sure you want to unpublish?");
      if (!answer) return;
      const { data } = await axios.put(`/api/post/unpublish/${post._id}`);
      toast("Your post is unpublished");
      loadPostsByAuthor();
    } catch (err) {
      toast("Post unpublish failed. Try again");
    }
  };

  return (
    <AuthorRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius">
        Posts
      </h1>

      {posts &&
        posts.map((post, index) => (
          <div className="media pb-1" key={post._id}>
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <Link href={`/author/post/${post.slug}`} className="pointer">
                    <a>
                      <h5 className="mt-2 text-primary">
                        <Avatar>{index + 1}</Avatar> {post.title}
                      </h5>
                    </a>
                  </Link>
                </div>

                {/* published? */}
                <div className="mt-3 float-right pr-2">
                  {post.published ? (
                    <>
                      <Tooltip title="Unpublish">
                        <CloseCircleOutlined
                          onClick={() => handleUnpublish(post)}
                          className="h5 text-warning pr-2 pl-2"
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteOutlined
                          onClick={() => handleDelete(post)}
                          className="h5 text-danger pointer pr-2 pl-2"
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Publish">
                        <CheckCircleOutlined
                          onClick={() => handlePublish(post)}
                          className="h5 text-success pr-2 pl-2"
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteOutlined
                          onClick={() => handleDelete(post)}
                          className="h5 text-danger pointer pr-2 pl-2"
                        />
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      <br />
    </AuthorRoute>
  );
};

export default AuthorIndex;
