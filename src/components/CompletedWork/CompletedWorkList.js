import React from 'react';
import { useQuery, gql } from '@apollo/client';
import CompletedWork from "./CompletedWork";
import CreateCompletedWork from "./CreateCompletedWork";

export const COMPLETED_WORK_QUERY = gql`
  query {
    completedWorkList{
        edges {
            node {
                id
                name
                cost
                hours
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
    const { data } = useQuery(COMPLETED_WORK_QUERY);

    return (
        <div>
            <CreateCompletedWork/>

            {data && (
                <>
                    {data.completedWorkList.edges.map((item, index) => (
                        <CompletedWork key={item.node.id} node={item.node} index={index}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default SpareList;
