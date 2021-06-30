import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import AuthorNav from "../nav/AuthorNav";

const AuthorRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAuthor();
  }, []);

  const fetchAuthor = async () => {
    try {
      let { data } = await axios.get("/api/current-author");
      // console.log("current-author", data);
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
          <AuthorNav />
        </div>
        <div className="col-md-10">{children}</div>
      </div>
    </div>
  );
};

export default AuthorRoute;
