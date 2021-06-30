import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../../context";
import { useRouter } from "next/router";

const RegisterActivate = () => {
  // state
  const [loading, setLoading] = useState(true);
  // router
  const router = useRouter();

  // context
  const {
    state: { user },
  } = useContext(Context);

  // redirect if already logged in
  useEffect(() => {
    if (user !== null) router.push("/");
  }, []);

  useEffect(() => {
    // console.log("REGISTER-ACTIVATE", router.query.slug);
    if (router && router.query && router.query.slug)
      handleSubmit(router.query.slug);
  }, [router.query.slug]);

  const handleSubmit = async (jwtLink) => {
    try {
      let { data } = await axios.post(`/api/register-activate`, { jwtLink });

      if (data.ok) {
        toast("Registration successful. Please login");
        router.push("/login");
      }
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  return (
    <>
      {loading ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <ExclamationCircleOutlined className="d-flex justify-content-center display-1 text-primary p-5" />
      )}
    </>
  );
};

export default RegisterActivate;
