import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // context
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  // router
  const router = useRouter();

  // redirect if already logged in
  useEffect(() => {
    if (user !== null) router.push("/");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await axios.post(`/api/login`, {
        email,
        password,
      });
      console.log("login res ==> ", res);
      // return;
      dispatch({
        type: "LOGIN",
        payload: res.data,
      });
      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(res.data));
      // redirect
      // router.push("/user");
      if (res.data.role.includes("Admin")) {
        router.push("/admin");
      } else if (res.data.role.includes("Instructor")) {
        router.push("/instructor");
      } else {
        router.push("/user");
      }
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
      console.log("err.response =====> ", err.response);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          <input
            type="password"
            className="form-control p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <br />
          <button
            type="submit"
            className="btn btn-block btn-primary p-2"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        <p className="text-center pt-3">
          Not yet registered?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>

        <p className="text-center">
          <Link href="/forgot-password">
            <a className="text-danger">Forgot password</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
