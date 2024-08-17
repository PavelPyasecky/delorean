import React from 'react';
import {timeDifferenceForDate} from "./utils/utils";

const Spare = (props) => {
    // eslint-disable-next-line react/prop-types
    const { node } = props;
    window.console.log(node)
    return (
        <div>
            <div>
                {/* eslint-disable-next-line react/prop-types */}
                {node.name}{' '}
                {/* eslint-disable-next-line react/prop-types */}
                {node.count}{' '}
                {/* eslint-disable-next-line react/prop-types */}
                {node.cost}{' '}
                {/* eslint-disable-next-line react/prop-types */}
                {node.createdBy.username}{' '}
                {/* eslint-disable-next-line react/prop-types */}
                {timeDifferenceForDate(node.createdDate)}
            </div>
        </div>
    );
};

export default Spare;
