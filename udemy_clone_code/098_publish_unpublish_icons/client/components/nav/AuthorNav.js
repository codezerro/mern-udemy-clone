import { useState, useEffect } from "react";
import Link from "next/link";

const AuthorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/author">
        <a className={`nav-link ${current === "/author" && "active"}`}>
          Dashboard
        </a>
      </Link>

      <Link href="/author/post/create">
        <a
          className={`nav-link ${
            current === "/author/post/create" && "active"
          }`}
        >
          Write a post
        </a>
      </Link>

      <Link href="/user/support">
        <a className={`nav-link ${current === "/user/support" && "active"}`}>
          Help and Support
        </a>
      </Link>
    </div>
  );
};

export default AuthorNav;
