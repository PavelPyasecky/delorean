import React from 'react';
import { useQuery, gql } from '@apollo/client';
import CreateSpare from "./CreateSpare";
import SparesTable from "./SparesTable";

export const SPARES_QUERY = gql`
  query {
    spares{
        edges {
            node {
                id
                name
                cost
                count
                createdDate
                createdBy{
                    id
                    username
                    firstName
                    lastName
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
    const { loading, error, data } = useQuery(SPARES_QUERY);

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    return (
        <div>
            <CreateSpare/>
            <br/>
            <br/>
            <SparesTable dataTable={data.spares} />
        </div>
    );
};

export default SpareList;
