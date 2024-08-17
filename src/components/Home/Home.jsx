import React, { useState } from 'react';
import {
    AreaChartOutlined,
    CarOutlined, HomeOutlined, LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, ToolOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import {Link, Outlet, useNavigate} from "react-router-dom";
import {AUTH_TOKEN} from "../../constants";

const { Header, Sider, Content } = Layout;
const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
        <Layout style={{height:'100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <Link to={"/"}><HomeOutlined /></Link>,
                            label: 'Home',
                        },
                        {
                            key: '2',
                            icon: <Link to={"/vehicles"}><CarOutlined /></Link>,
                            label: 'List Vehicles',
                        },
                        authToken && {
                            key: '3',
                            icon: <Link to={"/register"}><CarOutlined /></Link>,
                            label: 'Register Vehicle',
                        },
                        authToken && {
                            key: '4',
                            icon: <Link to={"/spares"}><ToolOutlined /></Link>,
                            label: 'Spares',
                        },
                        authToken && {
                            key: '5',
                            icon: <Link to={"/analytics"}><AreaChartOutlined /></Link>,
                            label: 'Analytics',
                        },
                        authToken ?? {
                            key: '6',
                            icon: <Link to={"/login"}><LoginOutlined /></Link>,
                            label: 'login',
                        },
                        authToken && {
                            key: '7',
                            icon: <Link to={"/"} onClick={()=>{localStorage.removeItem(AUTH_TOKEN);
                                navigate(`/`);}} ><LoginOutlined /></Link>,
                            label: 'logout',
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
export default Home;
