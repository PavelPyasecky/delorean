import {Button, theme} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import React from "react";
import {Header} from "antd/es/layout/layout";

// eslint-disable-next-line react/prop-types
const MyHeader = ({collapsed, setCollapsed}) => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
        </Header>
    );
}

export default MyHeader;