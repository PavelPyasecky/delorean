import React from 'react';
import {timeDifferenceForDate} from "./utils/utils";

const Vehicle = (props) => {
    // eslint-disable-next-line react/prop-types
    const { vehicle } = props;
    return (
        <div>
            <div>
                {/* eslint-disable-next-line react/prop-types */}
                {vehicle.vin}{' '}
                {/* eslint-disable-next-line react/prop-types */}
                {vehicle.owner ? vehicle.owner.username : 'Unknown'}{' '}
                {/* eslint-disable-next-line react/prop-types */}
                {timeDifferenceForDate(vehicle.createdDate)}
            </div>
        </div>
    );
};

export default Vehicle;
