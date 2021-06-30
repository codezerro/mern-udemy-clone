import { useState, useEffect } from "react";
import UserRoute from "../../components/routes/UserRoute";
import ContactForm from "../../components/forms/ContactForm";
import axios from "axios";
import Link from "next/link";
import { Tooltip } from "antd";
import {
  CheckOutlined,
  LoadingOutlined,
  IssuesCloseOutlined,
  DeleteOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const UserIndex = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserIssues();
  }, []);

  const loadUserIssues = async () => {
    const { data } = await axios.get("/api/user/issues");
    console.log(data);
    setIssues(data);
  };

  const markResolved = async (issueId) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/user/issue/mark-resolved`, {
        issueId,
      });
      loadUserIssues();
      // console.log("ISSUE RESOLVED =>", data);
      toast("You marked it resolved");
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast("Error!");
      setLoading(false);
    }
  };

  const deleteIssue = async (issueId) => {
    console.log(issueId);
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/user/issue/delete/${issueId}`);
      loadUserIssues();
      // console.log("ISSUE RESOLVED =>", data);
      toast("Issue deleted");
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast("Error!");
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius">
        Help & Support
      </h1>

      <div className="container-fluid">
        <div className="row pt-2">
          <div className="col-md-8 pb-5">
            <div className="lead alert alert-primary">
              Contact our help and support team using the form below for any
              issues.
            </div>

            <ContactForm loadUserIssues={loadUserIssues} />
          </div>
          <div className="col-md-4 pb-4 text-rr">
            <h4>CodeContinue</h4>
            <hr />
            <p className="lead">Find us on twitter</p>
            <a
              style={{ paddingTop: "2px" }}
              className="lead"
              href="https://twitter.com/CodeContinue?ref_src=twsrc%5Etfw"
              target="_blank"
            >
              <TwitterOutlined /> @CodeContinue
            </a>
          </div>
        </div>

        {/* show provious support posts */}
        <div className="row pt-2">
          {/* <pre>{JSON.stringify(issues, null, 4)}</pre> */}

          {issues.map((issue) => (
            <div key={issue._id} className="col-md-12 pb-4">
              <ul className="list-group">
                <li className="list-group-item">
                  {issue.course_url ? (
                    <Link href={issue.course_url}>
                      <a target="_blank">{issue.course_url}</a>
                    </Link>
                  ) : (
                    "No URL"
                  )}
                </li>

                <li className="list-group-item">{issue.message}</li>
                <li className="list-group-item">{issue.postedBy.name}</li>
                <li className="list-group-item">{issue.postedBy.email}</li>
                <li className="list-group-item">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </li>
                {/* bottom icons */}
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    {!issue.resolved ? (
                      <>
                        {loading ? (
                          <LoadingOutlined className="text-success h4" />
                        ) : (
                          <span
                            onClick={() => markResolved(issue._id)}
                            className="pointer"
                          >
                            {
                              <IssuesCloseOutlined className="text-success h4" />
                            }{" "}
                            Mark Resolved
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <CheckOutlined className="text-success h4" /> You marked
                        it resolved on{" "}
                        {new Date(issue.updatedAt).toLocaleDateString()}{" "}
                      </>
                    )}

                    <Tooltip title="Delete">
                      <DeleteOutlined
                        onClick={() => deleteIssue(issue._id)}
                        className="text-danger h4"
                      />
                    </Tooltip>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </UserRoute>
  );
};

export default UserIndex;
