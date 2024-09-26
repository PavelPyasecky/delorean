import React, {useEffect} from 'react';
import {useQuery, gql} from '@apollo/client';
import Spare from "./Spare";

const SPARES_QUERY = gql`
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
                }
            }
    `
;

const NEW_SPARE_SUBSCRIPTION = gql`
    subscription {
        mySubscription{
            spare{
                id,
                name,
                count,
                cost,
                createdDate,
            },
        }
    }
`;

const SpareList = () => {
    const {
        data,
        loading,
        error,
        subscribeToMore
    } = useQuery(SPARES_QUERY);


    const subscribeToNewComments = () => subscribeToMore({
        document: NEW_SPARE_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData}) => {
            if (!subscriptionData.data) return prev;

            console.log('----------------------');
            console.log(subscriptionData);
            console.log(prev);
            console.log(prev.spares);
            // console.log(prev.spares?.pageIngo);
            console.log('----------------------');

            const newSpare = subscriptionData.data.getLatestSpare;
            newSpare.__typename = 'SparesNode'
            const exists = prev.spares.edges.find(
                (item) => item.node.id === newSpare.id
            );
            if (exists) return prev;
            console.log('1');

            return Object.assign({}, prev, {
                spares: {
                    edges: [...prev.spares.edges, {node: {...newSpare}}],
                    // pageIngo: prev.spares?.pageIngo
                },
            });
        },
    });

    useEffect(() => subscribeToNewComments(), []);


    return (
        <div>
            {data && (
                <>
                    {data.spares?.edges.map((item, index) => (
                        <Spare key={item.node.id} node={item.node} index={index}/>
                    ))}
                </>
            )}
        </div>
    );
};

export default SpareList;
