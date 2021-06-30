import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Badge } from "antd";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  useEffect(() => {
    loadQuestionCount();
  }, []);

  const loadQuestionCount = async () => {
    const { data } = await axios.get(`/api/instructor/question-count`);
    setQuestionCount(data);
  };

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/instructor">
        <a className={`nav-link ${current === "/instructor" && "active"}`}>
          Dashboard
        </a>
      </Link>

      <Link href="/instructor/course/create">
        <a
          className={`nav-link ${
            current === "/instructor/course/create" && "active"
          }`}
        >
          Create Course
        </a>
      </Link>

      <Link href="/instructor/revenue">
        <a
          className={`nav-link ${
            current === "/instructor/revenue" && "active"
          }`}
        >
          Revenue
        </a>
      </Link>

      <Link href="/user/support">
        <a className={`nav-link ${current === "/user/support" && "active"}`}>
          Help and Support
        </a>
      </Link>

      <Link href="/instructor/qa">
        <a className={`nav-link ${current === "/instructor/qa" && "active"}`}>
          <Badge count={questionCount} offset={[21, 7]}>
            Q&A
          </Badge>
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
