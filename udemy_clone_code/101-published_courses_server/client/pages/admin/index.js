import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs } from "antd";
import AdminRoute from "../../components/routes/AdminRoute";

const { TabPane } = Tabs;

const AdminIndex = () => {
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
  const [showModal, setShowModal] = useState(false);

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
      <p>...</p>
    </AdminRoute>
  );
};

export default AdminIndex;
