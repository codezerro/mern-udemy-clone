import React from "react";
import Link from "next/link";
import { Menu } from "antd";
import {
    LogoutOutlined,
    AppstoreAddOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
const { Item } = Menu;

const Navbar = () => {
    return (
        <>
            <Menu mode='horizontal'>
                <Item icon={<AppstoreAddOutlined />}>
                    <Link href='/'>
                        <a>App</a>
                    </Link>
                </Item>

                <Item icon={<LogoutOutlined />}>
                    <Link href='/login'>
                        <a>Login</a>
                    </Link>
                </Item>

                <Item icon={<UserAddOutlined />}>
                    <Link href='/register'>
                        <a>Register</a>
                    </Link>
                </Item>
            </Menu>
        </>
    );
};

export default Navbar;
