import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import InstructorNav from "../nav/InstructorNav";

const InstructorRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchInstructor();
  }, []);

  const fetchInstructor = async () => {
    try {
      let { data } = await axios.get("/api/current-instructor");
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
          <InstructorNav />
        </div>
        <div className="col-md-10">{children}</div>
      </div>
    </div>
  );
};

export default InstructorRoute;
