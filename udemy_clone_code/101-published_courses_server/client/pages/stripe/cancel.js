import { CloudSyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";

const StripeCancel = () => {
  return (
    <UserRoute showNav={false}>
      {/* <h1 className="jumbotron text-center square">User Dashboard</h1> */}
      <div className="row text-center">
        <div className="col-md-9">
          <CloudSyncOutlined className="display-1 text-danger p-5 h4" />
          <p className="lead">Payment Failed. Try Again.</p>
        </div>
        <div className="col-md-3"></div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
