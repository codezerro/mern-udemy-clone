import { useContext, useState } from "react";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
  EditOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";
import AuthorTerms from "../../components/modal/AuthorTerms";
import { Context } from "../../context";
import { useRouter } from "next/router";

const BecomeAuthor = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // router
  const router = useRouter();

  const makeAuthor = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/make-author");
      setLoading(false);
      dispatch({
        type: "LOGIN",
        payload: data,
      });
      // save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      toast("Congrats! You can start writting now.");
      setTimeout(() => {
        router.push("/author");
      }, 2000);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast("Error occured. Try again.");
    }
  };

  return (
    <UserRoute>
      {/* <h1 className="jumbotron text-center square">Become Instructor</h1> */}

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <FormOutlined className="h2" />
              <br />
              {/* <h4>Setup payouts to publish courses on Code Continue</h4>
              <p>...</p> */}

              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                size="large"
                onClick={makeAuthor}
                disabled={
                  (user && user.role && user.role.includes("Author")) || loading
                }
                loading={loading}
              >
                Become Author
              </Button>

              <p className="text-muted">
                <small>
                  <span
                    onClick={() => setShowModal(true)}
                    className="pointer text-danger"
                  >
                    Why write on codecontinue?
                  </span>
                </small>
              </p>
            </div>
          </div>
        </div>

        <AuthorTerms showModal={showModal} setShowModal={setShowModal} />
      </div>
    </UserRoute>
  );
};

export default BecomeAuthor;
