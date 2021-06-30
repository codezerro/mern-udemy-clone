import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";

const StripeCallback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    // console.log(user);
    if (user)
      axios.post("/api/get-account-status").then((res) => {
        console.log("GET_ACCOUNT_STATUS_RES -> ", res);
        dispatch({
          type: "LOGIN",
          payload: res.data,
        });
        window.localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/instructor";
      });
  }, [user]);

  return (
    <UserRoute>
      <SyncOutlined
        spin
        className="d-flex justify-content-center display-1 text-primary p-5"
      />
    </UserRoute>
  );
};

export default StripeCallback;
