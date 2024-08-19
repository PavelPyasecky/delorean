import React, {useState} from 'react';
import {Layout} from 'antd';

import MySidebar from "./Sidebar/Sidebar";
import MyHeader from "./Header/Header";
import MyContent from "./Content/Content";

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{height: '100vh'}}>
            <MySidebar collapsed={collapsed}/>
            <Layout>
                <MyHeader collapsed={collapsed} setCollapsed={setCollapsed}/>
                <MyContent/>
            </Layout>
        </Layout>
    );
};
export default Home;
