import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Spare from "./Spare";

const VEHICLE_QUERY = gql`
  query {
    spares{
        edges {
            node {
                id
                name
                cost
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

const SpareList = () => {
    const { data } = useQuery(VEHICLE_QUERY);

    return (
        <div>
            {data && (
                <>
                    {data.spares.edges.map((item, index) => (
                        <Spare key={item.id} node={item.node} index={index}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default SpareList;
