import React from 'react';
import { useQuery, gql } from '@apollo/client';
import CompletedWork from "./CompletedWork";
import CreateCompletedWork from "./CreateCompletedWork";
import TableList from "./CompletedWorkTable";

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

const CompletedWorkList = () => {
    const { loading, error, data  } = useQuery(COMPLETED_WORK_QUERY);
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    let preparedData = [];
    if (data && data.completedWorkList) {
        preparedData = data.completedWorkList.edges.map(item => {
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
            <CreateCompletedWork/>

            <br></br>
            <br></br>
            <TableList dataTable={preparedData}/>
        </div>
    );
};

export default CompletedWorkList;
