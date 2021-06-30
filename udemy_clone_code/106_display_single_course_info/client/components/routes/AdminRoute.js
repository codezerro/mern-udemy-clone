import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import AdminNav from "../nav/AdminNav";

const AdminRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      let { data } = await axios.get("/api/current-admin");
      // console.log("current-user", data);
      //   console.log("data", data);
      if (data.ok) setOk(true);
    } catch (err) {
      // alert("no user");
      router.push("/");
    }
  };

  return !ok ? (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  ) : (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">{children}</div>
      </div>
    </div>
  );
};

export default AdminRoute;
