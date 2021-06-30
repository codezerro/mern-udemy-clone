import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import { Menu } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  AppstoreOutlined,
  CarryOutOutlined,
  TeamOutlined,
  CoffeeOutlined,
  AudioOutlined,
  DesktopOutlined,
  FormOutlined,
  EditOutlined,
  ReadOutlined,
} from "@ant-design/icons";
// unlike react-router-dom dont destructure {Link}
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

// https://prawira.medium.com/react-conditional-import-conditional-css-import-110cc58e0da6

// import themes
// const LightTheme = React.lazy(() => import("../themes/LightTheme"));
// const DarkTheme = React.lazy(() => import("../themes/DarkTheme"));

const TopNav = () => {
  const [current, setCurrent] = useState("");
  // context
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  // router
  const router = useRouter();
  // destructure components from Menu
  const { Item, SubMenu, ItemGroup } = Menu;

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  //create a parent component that will load the components conditionally using React.Suspense
  // const ThemeSelector = ({ children }) => {
  //   const CHOSEN_THEME = "DARK_MODE";
  //   return (
  //     <>
  //       <React.Suspense fallback={<></>}>
  //         <DarkTheme />
  //         {/* {CHOSEN_THEME === TYPE_OF_THEME.LIGHT_MODE && <LightTheme />}
  //         {CHOSEN_THEME === TYPE_OF_THEME.DARK_MODE && <DarkTheme />} */}
  //       </React.Suspense>
  //       {children}
  //     </>
  //   );
  // };

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/logout");
      dispatch({ type: "LOGOUT" });
      window.localStorage.removeItem("user");
      if (data) {
        toast(data.message);
        router.push("/login");
      }
    } catch (err) {
      toast("Logout failed. Try again.");
    }
  };

  return (
    <>
      {/* <DarkTheme /> */}
      <Menu
        onClick={(e) => setCurrent(e.key)}
        selectedKeys={[current]}
        mode="horizontal"
      >
        <Item key="/">
          <Link href="/">
            <a className="typewriter">
              <div className="pt-1">
                <img
                  src="/images/logo/codecontinue.png"
                  alt="code continue logo"
                  height="40"
                  className="mb-1"
                />
              </div>
            </a>
          </Link>
        </Item>

        <Item icon={<ReadOutlined />} key="/articles">
          <Link href="/articles">
            <a className="typewriter">Articles</a>
          </Link>
        </Item>

        {user && user.role && user.role.includes("Author") ? (
          <></>
        ) : (
          <Item icon={<FormOutlined />} key="/user/become-author">
            <Link href="/user/become-author">
              <a className="typewriter">Become Author</a>
            </Link>
          </Item>
        )}

        {user &&
        user.role &&
        user.stripe_seller &&
        user.role.includes("Instructor") &&
        user.stripe_seller.charges_enabled ? (
          <></>
        ) : (
          <Item icon={<TeamOutlined />} key="/user/become-instructor">
            <Link href="/user/become-instructor">
              <a className="typewriter">Become Instructor</a>
            </Link>
          </Item>
        )}

        {user === null && (
          <>
            <Item
              icon={<UserAddOutlined />}
              key="/register"
              className="float-right"
            >
              <Link href="/register">
                <a>Register</a>
              </Link>
            </Item>

            <Item icon={<LoginOutlined />} key="/login" className="float-right">
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Item>
          </>
        )}

        {user !== null && (
          <SubMenu
            icon={<CoffeeOutlined />}
            title={user.name}
            className="float-right"
          >
            <ItemGroup>
              <Item key="/user">
                <Link href="/user">
                  <a>Dashboard</a>
                </Link>
              </Item>

              <Item onClick={logout}>Logout</Item>
            </ItemGroup>
          </SubMenu>
        )}

        {user &&
          user.role &&
          user.stripe_seller &&
          user.role.includes("Instructor") &&
          user.stripe_seller.charges_enabled && (
            <Item
              icon={<AudioOutlined />}
              key="/instructor"
              className="float-right"
            >
              <Link href="/instructor">
                <a className="typewriter">Instructor</a>
              </Link>
            </Item>
          )}

        {user && user.courses && user.courses.length >= 1 && (
          <Item icon={<DesktopOutlined />} key="/user" className="float-right">
            <Link href="/user">
              <a className="typewriter">Student</a>
            </Link>
          </Item>
        )}

        {user && user.role && user.role.includes("Author") && (
          <Item icon={<EditOutlined />} key="/author" className="float-right">
            <Link href="/author">
              <a className="typewriter">Author</a>
            </Link>
          </Item>
        )}

        {user && user.role && user.role.includes("Admin") && (
          <Item icon={<AudioOutlined />} key="/admin" className="float-right">
            <Link href="/admin">
              <a className="typewriter">Admin</a>
            </Link>
          </Item>
        )}
      </Menu>
    </>
  );
};

export default TopNav;
