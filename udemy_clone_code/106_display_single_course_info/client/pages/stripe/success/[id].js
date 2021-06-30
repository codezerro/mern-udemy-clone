import { useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";

const StripeSuccess = () => {
  // router
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) successRequest();
  }, [id]);

  const successRequest = async () => {
    try {
      const { data } = await axios.get(`/api/stripe-success/${id}`);
      // console.log("STRIPE SUCCESS FROM BACKEND => ", data);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      router.push(`/user`);
    }
  };

  return (
    <UserRoute showNav={false}>
      {/* <h1 className="jumbotron text-center square">User Dashboard</h1> */}
      <div className="row text-center">
        <div className="col-md-9 pb-5">
          <div className="d-flex justify-content-center p-5">
            <SyncOutlined spin className="display-1 text-danger p-5 h4" />
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </UserRoute>
  );
};

export default StripeSuccess;
