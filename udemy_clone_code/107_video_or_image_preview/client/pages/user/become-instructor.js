import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";
import InstructorTerms from "../../components/modal/InstructorTerms";

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { state } = useContext(Context);
  const { user } = state;

  const becomeInstructor = () => {
    setLoading(true);
    axios
      .post("/api/make-instructor")
      .then((res) => {
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err.response.status);
        toast.error("Stripe onboarding failed. Try again.");
        setLoading(false);
      });
  };

  return (
    <UserRoute>
      {/* <h1 className="jumbotron text-center square">Become Instructor</h1> */}

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Code Continue</h2>
              <p className="lead text-warning">
                Code Continue partners with{" "}
                <a href="https://stripe.com/" target="_blank">
                  Stripe
                </a>{" "}
                to transfer earnings to your bank account.
              </p>

              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user &&
                    user.role &&
                    user.stripe_seller &&
                    user.role.includes("Instructor") &&
                    user.stripe_seller.charges_enabled) ||
                  loading
                }
              >
                {loading ? "Processing..." : "Payout Setup"}
              </Button>

              <p className="text-muted">
                You'll be redirected to Stripe to complete the onboarding
                proces. By clicking on the button above, you agree to our{" "}
                <span
                  onClick={() => setShowModal(true)}
                  className="pointer text-danger"
                >
                  Terms & Conditions
                </span>
                .
              </p>

              <div className="alert alert-danger square">
                Do not change your email during payout setup.
              </div>
            </div>
          </div>
        </div>

        <InstructorTerms showModal={showModal} setShowModal={setShowModal} />
      </div>
    </UserRoute>
  );
};

export default BecomeInstructor;
