import { useState, useEffect } from "react";
import Link from "next/link";

const AdminNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/admin">
        <a className={`nav-link ${current === "/admin" && "active"}`}>
          Dashboard
        </a>
      </Link>

      <Link href="/admin/users">
        <a className={`nav-link ${current === "/admin/users" && "active"}`}>
          Users
        </a>
      </Link>

      <Link href="/admin/category">
        <a className={`nav-link ${current === "/admin/category" && "active"}`}>
          Categories
        </a>
      </Link>

      <Link href="/admin/issues">
        <a className={`nav-link ${current === "/admin/issues" && "active"}`}>
          Issues
        </a>
      </Link>

      <Link href="/admin/posts">
        <a className={`nav-link ${current === "/admin/posts" && "active"}`}>
          Posts
        </a>
      </Link>
    </div>
  );
};

export default AdminNav;
