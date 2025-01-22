import React from 'react';
import Vehicle from './Vehicle';
import { useQuery, gql } from '@apollo/client';
import VehicleTable from "./VehicleTable";

export const VEHICLE_QUERY = gql`
  {
  vehicle{
    id,
    vin,
    createdDate,
    owner{
        username
        firstName
        lastName
        }
    }
  }
`
;

const VehicleList = () => {
    const { loading, error, data } = useQuery(VEHICLE_QUERY);

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    let preparedData = [];
    if (data && data.vehicle) {
        preparedData = data.vehicle.map(item => {
            return {
                ...item,
                createdDate: item.createdDate.split('T')[0],
                ownerName: `${item.owner.firstName} ${item.owner.lastName}`,
                key: item.id
            }
        })
    }

    return (
        <div>
            <VehicleTable dataTable={preparedData}/>
        </div>
    );
};

export default VehicleList;
