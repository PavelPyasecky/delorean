import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Spare from "./Spare";
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

    let preparedData = [];
    if (data && data.spares) {
        preparedData = data.spares.edges.map(item => {
            item = item.node;
            return {
                ...item,
                createdDate: item.createdDate.split('T')[0],
                authorName: `${item.createdBy.firstName} ${item.createdBy.lastName}`,
                key: item.id
            }
        })
    }

    return (
        <div>
            <CreateSpare/>
            <br/>
            <br/>
            <SparesTable dataTable={preparedData} />
        </div>
    );
};

export default SpareList;
