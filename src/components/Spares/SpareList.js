import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Spare from "./Spare";
import CreateSpare from "./CreateSpare";

export const SPARES_QUERY = gql`
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
    const { data } = useQuery(SPARES_QUERY);

    return (
        <div>
            <CreateSpare/>
            {data && (
                <>
                    {data.spares.edges.map((item, index) => (
                        <Spare key={item.node.id} node={item.node} index={index}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default SpareList;
