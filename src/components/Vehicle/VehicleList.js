import React from 'react';
import Vehicle from './Vehicle';
import { useQuery, gql } from '@apollo/client';

export const VEHICLE_QUERY = gql`
  {
  vehicle{
    id,
    vin,
    createdDate,
    owner{
        username
        }
    }
  }
`
;

const VehicleList = () => {
    const { data } = useQuery(VEHICLE_QUERY);

    return (
        <div>
            {data && (
                <>
                    {data.vehicle.map((item, index) => (
                        <Vehicle key={item.id} vehicle={item} index={index}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default VehicleList;
