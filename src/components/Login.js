import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {gql, useMutation} from "@apollo/client";
import {AUTH_TOKEN} from "../constants";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password1: String!
    $password2: String!
    $username: String!
  ) {
  register(
    input: {
      email: $email,
      username: $username,
      password1: $password1,
      password2: $password2,
    }
  ) {
    success,
    errors,
    token,
  }
}
`;


const Login = () => {
    const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $username: String!
    $password: String!
  ) {
    tokenAuth(
    input: {
      username: $username,
      password: $password
    }
  ) {
    success,
    errors,
    unarchiving,
    token,
  }
  }
`;

    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        login: true,
        email: '',
        password1: '',
        password2: '',
        username: ''
    });


    const [login] = useMutation(LOGIN_MUTATION, {
        variables: {
            username: formState.username,
            password: formState.password1
        },
        onCompleted: ({ token }) => {
            localStorage.setItem(AUTH_TOKEN, token);
            navigate('/');
        }
    });

    const [signup] = useMutation(SIGNUP_MUTATION, {
        variables: {
            username: formState.username,
            email: formState.email,
            password1: formState.password1,
            password2: formState.password2
        },
        onCompleted: ({ token }) => {
            localStorage.setItem(AUTH_TOKEN, token);
            navigate('/');
        }
    });


    return (
        <div>
            <h4 className="mv3">
                {formState.login ? 'Login' : 'Sign Up'}
            </h4>
            <div className="flex flex-column">
                {!formState.login && (
                    <input
                        value={formState.email}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                email: e.target.value
                            })
                        }
                        type="email"
                        placeholder="Your email address"
                    />
                )}
                <input
                    value={formState.username}
                    onChange={(e) =>
                        setFormState({
                            ...formState,
                            username: e.target.value
                        })
                    }
                    type="text"
                    placeholder="Your username"
                />
                <input
                    value={formState.password1}
                    onChange={(e) =>
                        setFormState({
                            ...formState,
                            password1: e.target.value
                        })
                    }
                    type="password"
                    placeholder="Choose a safe password"
                />
                {!formState.login && (<input
                    value={formState.password2}
                    onChange={(e) =>
                        setFormState({
                            ...formState,
                            password2: e.target.value
                        })
                    }
                    type="password"
                    placeholder="Repeat your password"
                />)}
            </div>
            <div className="flex mt3">
                <button
                    className="pointer mr2 button"
                    onClick={formState.login ? login : signup}
                >
                    {formState.login ? 'login' : 'create account'}
                </button>
                <button
                    className="pointer button"
                    onClick={(e) =>
                        setFormState({
                            ...formState,
                            login: !formState.login
                        })
                    }
                >
                    {formState.login
                        ? 'need to create an account?'
                        : 'already have an account?'}
                </button>
            </div>
        </div>
    );
};

export default Login;
