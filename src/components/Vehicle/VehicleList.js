import React, {useState} from 'react';
import Vehicle from './Vehicle';
import {useQuery, gql, useLazyQuery} from '@apollo/client';
import VehicleSearch from "./VehicleSearch/VehicleSearch";

export const VEHICLE_QUERY = gql`
            query VehicleSearchQuery{
                vehicles{
                    edges {
                        node {
                            id
                            vin
                            country
                            createdDate
                            createdBy{
                                id
                                username
                                email
                            }
                        }
                    }
                    pageInfo{
                        startCursor,
                        endCursor
                    }
                }
            }
    `
;

export const FILTER_VEHICLE_QUERY = gql`
            query VehicleSearchQuery($vin: String!){
                vehicles(vin:$vin){
                    edges {
                        node {
                            id
                            vin
                            country
                            createdDate
                            createdBy{
                                id
                                username
                                email
                            }
                        }
                    }
                    pageInfo{
                        startCursor,
                        endCursor
                    }
                }
            }
    `
;

const VehicleList = () => {
    const { data:dataList } = useQuery(VEHICLE_QUERY);
    const [executeSearch, { data:dataSearch }] = useLazyQuery(FILTER_VEHICLE_QUERY);
    const [searchFilter, setSearchFilter] = useState('');

    let data = dataSearch ? dataSearch : dataList;

    return (
        <div>
            <VehicleSearch setSearchFilter={setSearchFilter} executeSearch={executeSearch} searchFilter={searchFilter}/>
            {data && (
                <>
                    {data.vehicles.edges.map((item, index) => (
                        <Vehicle key={item.node.id} vehicle={item.node} index={index}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default VehicleList;
