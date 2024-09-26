import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './styles/index.css';
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache, HttpLink
} from '@apollo/client';
import {split} from '@apollo/client';
import {getMainDefinition} from '@apollo/client/utilities';
import Home from "./components/Home/Home";
import CreateVehicle from "./components/Vehicle/CreateVehicle";
import VehicleList from "./components/Vehicle/VehicleList";
import ErrorPage from "./components/utils/ErrorPage";
import Login from "./components/utils/Login";
import {setContext} from "@apollo/client/link/context";
import {AUTH_TOKEN} from "./constants";
import Spares from "./components/Spares/Spares";
import {SubscriptionClient} from "subscriptions-transport-ws";
import {WebSocketLink} from "@apollo/client/link/ws";

const httpLink = new HttpLink({
    uri: 'http://localhost:8000/graphql/'
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : ''
        }
    };
});

const token = localStorage.getItem(AUTH_TOKEN);

const wsLink = new WebSocketLink(
        new SubscriptionClient(`ws://localhost:8080/graphql/`,
            {
                connectionParams: {
                    authToken: token ? `JWT ${token}` : '',
                }
            },),
    )
;

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';

    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/vehicles",
                element: <VehicleList/>
            },
            {
                path: "/register",
                element: <CreateVehicle/>
            },
            {
                path: "/analytics",
                element: ""
            },
            {
                path: "/spares",
                element: <Spares/>
            },
            {
                path: "/login",
                element: <Login/>,
            },
        ]
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <RouterProvider router={router}/>
        </ApolloProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
