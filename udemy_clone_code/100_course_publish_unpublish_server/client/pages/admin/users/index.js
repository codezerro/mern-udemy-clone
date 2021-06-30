import { useState, useEffect } from "react";
import axios from "axios";
import { Tooltip } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import AdminRoute from "../../../components/routes/AdminRoute";

const AdminUsersIndex = () => {
  const [users, setUsers] = useState([
    {
      name: "",
      email: "",
      email_verified: Boolean,
      role: [],
      courses: [],
      stripe_account_id: "",
      stripe_seller: {},
      stripeSession: {},
      createdAt: "",
      updatedAt: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await axios.get("/api/admin/users");
    setUsers(data);
  };

  return (
    <AdminRoute>
      {/* <h1 className="jumbotron text-center square">...</h1> */}

      <div className="row">
        {users.map((user) => (
          <div key={user._id} className="col-md-12 pt-2 pb-4">
            <ul className="list-group text-dark">
              <li
                className={`list-group-item ${
                  user.stripe_seller
                    ? "bg-danger"
                    : user.courses && user.courses.length
                    ? "bg-warning"
                    : "bg-primary"
                } font-weight-bold text-white`}
              >
                {user.name}{" "}
                {user.stripeSession && (
                  <Tooltip title="Incomplete checkout">
                    <span className="float-right">
                      <WarningOutlined />
                    </span>
                  </Tooltip>
                )}
              </li>
              <li className="list-group-item">{user.email}</li>
              {/* <li className="list-group-item">
                Email verified {JSON.stringify(user.email_verified)}
              </li> */}
              <li className="list-group-item">
                Role {JSON.stringify(user.role)}
              </li>
              {user.stripe_account_id && (
                <li className="list-group-item">{user.stripe_account_id}</li>
              )}
              <li className="list-group-item">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </li>
              <li className="list-group-item">
                Late updated {new Date(user.updatedAt).toLocaleDateString()}
              </li>
              {/* courses */}
              {user.courses && user.courses.length >= 1 && (
                <li
                  className="list-group-item bg-light"
                  style={{ height: "200px", overflow: "scroll" }}
                >
                  <p>courses</p>
                  <hr />
                  <pre>{JSON.stringify(user.courses, null, 4)}</pre>
                </li>
              )}
              {/* stripe_seller */}
              {user.stripe_seller && (
                <li
                  className="list-group-item bg-light"
                  style={{ height: "200px", overflow: "scroll" }}
                >
                  <p>stripe_seller</p>
                  <hr />
                  <pre>{JSON.stringify(user.stripe_seller, null, 4)}</pre>
                </li>
              )}
              {/* stripeSession */}
              {user.stripeSession && (
                <li
                  className="list-group-item"
                  style={{ height: "200px", overflow: "scroll" }}
                >
                  <p>stripeSession</p>
                  <hr />
                  <pre>{JSON.stringify(user.stripeSession, null, 4)}</pre>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </AdminRoute>
  );
};

export default AdminUsersIndex;
