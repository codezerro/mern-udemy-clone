import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const StudentRoute = ({ children, showNav = true }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      let { data } = await axios.get("/api/current-user");
      // console.log("current-user", data);
      //   console.log("data", data);
      if (data.ok) setOk(true);
    } catch (err) {
      // alert("no user");
      router.push("/login");
    }
  };

  return !ok ? (
    <SyncOutlined
      spin
      className="d-flex justify-content-center display-1 text-primary p-5"
    />
  ) : (
    <div className="container-fluid">{children}</div>
  );
};

export default StudentRoute;
