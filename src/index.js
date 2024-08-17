import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './styles/index.css';
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from '@apollo/client';
import Home from "./components/Home/Home";
import CreateVehicle from "./components/CreateVehicle";
import VehicleList from "./components/VehicleList";
import ErrorPage from "./components/utils/ErrorPage";
import Login from "./components/Login";
import {setContext} from "@apollo/client/link/context";
import {AUTH_TOKEN} from "./constants";
import SpareList from "./components/SpareList";

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/'
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
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
                element: <SpareList/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>,
    }
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
