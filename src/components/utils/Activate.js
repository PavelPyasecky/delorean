import React, {useEffect, useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import {useParams} from "react-router-dom";

const VERIFY_ACCOUNT_MUTATION = gql`
  mutation verifyAccountMutation(
    $token: String!
  ) {
  verifyAccount(
    input: {
      token: $token,
    }
  ) {
    success,
    errors,
  }
}
`;


const VerifyAccount = () => {
    const params = useParams();
    const [errorMessages, setErrorMessages] = useState([])

    const [verifyAccountMutation] = useMutation(VERIFY_ACCOUNT_MUTATION, {
        variables: {
            token: params.token,
        },
        onCompleted: ({verifyAccount}) => {
            console.log(verifyAccount);

            if (verifyAccount.errors) {
                let errorList = verifyAccount.errors.nonFieldErrors.map((item) => item.message);
                setErrorMessages(errorList);
            }
        }
    });

    useEffect(() => {
        verifyAccountMutation();
    }, [])


    return (
        <div>
            <h1>Activation status</h1>
            {errorMessages.length > 0 ? <h2>Some errors has been found:</h2> : <h2>Account activated successfully</h2>}
            {errorMessages.map((error, index) => <h3 key={index}>{error}</h3>)}
        </div>
    );
};

export default VerifyAccount;
