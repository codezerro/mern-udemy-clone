import { useState, useEffect } from "react";
import axios from "axios";
import { Tooltip } from "antd";
import {
  CheckOutlined,
  LoadingOutlined,
  WarningOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AdminRoute from "../../../components/routes/AdminRoute";
import Link from "next/link";
import { toast } from "react-toastify";

const AdminIssuesIndex = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    const { data } = await axios.get("/api/admin/issues");
    setIssues(data);
  };

  // resolved, url, name, email, postedBy[name, email], createdAt
  /**
   * to resolve, admin need to know
   * the course url (to know the course user was trying to enroll)
   * the user id (to know who is trying to enroll)
   */

  const handleEnrollmentIssue = async (issue) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/admin/refresh-user-status`, {
        userId: issue.postedBy._id,
        courseUrl: issue.course_url,
      });
      console.log("SESSION REFRESH =>", data);
      toast(data.message);
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
      const { data } = await axios.delete(`/api/admin/issue/delete/${issueId}`);
      loadIssues();
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
    <AdminRoute>
      {/* <h1 className="jumbotron text-center square">...</h1> */}

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
                  {issue.resolved ? (
                    <Tooltip title="Resolved">
                      {loading ? (
                        <LoadingOutlined className="text-success h4" />
                      ) : (
                        <CheckOutlined className="text-success h4" />
                      )}
                    </Tooltip>
                  ) : (
                    <Tooltip title="Not resolved">
                      {loading ? (
                        <LoadingOutlined className="text-danger h4" />
                      ) : (
                        <WarningOutlined
                          onClick={() => handleEnrollmentIssue(issue)}
                          className="text-danger h4 pointer"
                        />
                      )}
                    </Tooltip>
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
    </AdminRoute>
  );
};

export default AdminIssuesIndex;
