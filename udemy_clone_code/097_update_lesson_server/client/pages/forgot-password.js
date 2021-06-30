import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // send code to user email
      let { data } = await axios.post(`/api/forgot-password`, {
        email,
      });
      // shoe code input field
      setSuccess(true);
      setLoading(false);
      // ask user to check email and enter code
      toast("Check your email for the secret code.");
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // send code to user email
      let { data } = await axios.post(`/api/reset-password`, {
        email,
        code,
        newPassword,
      });
      setEmail("");
      setCode("");
      setNewPassword("");
      setLoading(false);
      // ask user to check email and enter code
      toast("Great! Now you can login with your new password");
      router.push("/login");
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Password Reset
      </h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          {success && (
            <>
              <input
                type="text"
                className="form-control mb-4 p-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
                required
              />

              <input
                type="password"
                className="form-control mb-4 p-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="btn btn-block btn-primary p-2"
            disabled={!email || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
