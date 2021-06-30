import Link from "next/link";
import { TwitterOutlined } from "@ant-design/icons";

const Footer = () => (
  <div
    className="container-fluid footer mt-5"
    style={{ borderTop: "1px solid #333" }}
  >
    <footer className="pt-5 pb-4">
      <div className="row">
        <div className="col-md-4">
          <Link href="/">
            <a>
              <img
                style={{ marginTop: "-10px" }}
                className="img-fluid mb-2"
                src="/images/logo/codecontinue.png"
                alt="codecontinue Logo"
              />
            </a>
          </Link>

          <small className="ml-2 d-block mb-3 text-muted">
            &copy; {new Date().getFullYear()}
          </small>
        </div>

        <div className="col-md-4">
          <h5>Code Continue</h5>
          <p className="lead">
            Join thousands of students at codecontinue and become part of a
            vibrant community. Learn the best of web development or become an
            instructor and teach others by creating courses.
          </p>
          <hr />
          <p className="lead">Find us on twitter</p>
          <a
            style={{ paddingTop: "2px" }}
            className="lead"
            href="https://twitter.com/CodeContinue?ref_src=twsrc%5Etfw"
            target="_blank"
          >
            <TwitterOutlined /> @CodeContinue
          </a>
        </div>

        <div className="col-md-4">
          <h5 className="pb-1">Become an instructor</h5>
          <p className="lead">
            The only eLearning marketplace that offers 70% revenue to it's
            instructors. Get paid directly to your bank account, every 48 hours.
            Are you ready to create your first course?
          </p>
          <Link href="/user/become-instructor">
            <a className="lead">Become Instructor</a>
          </Link>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
