import {Menu} from "antd";
import React from "react";
import {Header as HeaderAntd} from "antd/es/layout/layout";

// eslint-disable-next-line react/prop-types
const Header = ({items}) => {
    return <HeaderAntd style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
        }}>
        <div className="demo-logo"/>
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items}
            style={{
                flex: 1,
                minWidth: 0,
            }}
        />
    </HeaderAntd>
}

export default Header;
