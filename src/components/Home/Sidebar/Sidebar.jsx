import {Menu} from "antd";
import {Link} from "react-router-dom";
import {AreaChartOutlined, CarOutlined, HomeOutlined, LoginOutlined, ToolOutlined} from "@ant-design/icons";
import {AUTH_TOKEN} from "../../../constants";
import React, {useState} from "react";
import Sider from "antd/es/layout/Sider";


// eslint-disable-next-line react/prop-types
const Sidebar = ({collapsed}) => {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const [token, setToken] = useState(authToken)


    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical"/>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={[{
                    key: '1', icon: <Link to={"/"}><HomeOutlined/></Link>, label: 'Home',
                }, {
                    key: '2', icon: <Link to={"/vehicles"}><CarOutlined/></Link>, label: 'List Vehicles',
                }, token && {
                    key: '3', icon: <Link to={"/register"}><CarOutlined/></Link>, label: 'Register Vehicle',
                }, token && {
                    key: '4', icon: <Link to={"/spares"}><ToolOutlined/></Link>, label: 'Spares',
                }, token && {
                    key: '5', icon: <Link to={"/analytics"}><AreaChartOutlined/></Link>, label: 'Analytics',
                }]}
            />
            <Menu
                theme="dark"
                mode="inline"
                items={[
                    authToken ?? {
                    key: '6', icon: <Link to={"/login"}><LoginOutlined/></Link>, label: 'login',
                    },
                    authToken && {
                    key: '7', icon: <Link to={"/"} onClick={() => {
                        setToken('')
                        localStorage.removeItem(AUTH_TOKEN)
                    }}><LoginOutlined/></Link>, label: 'logout',
                }]}
                style={{position: 'absolute', bottom: '15px',}}
            />
        </Sider>
    );
}

export default Sidebar;
