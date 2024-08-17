import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import {useNavigate} from "react-router-dom";

const CREATE_VEHICLE_MUTATION = gql`
  mutation PostMutation(
    $vin: String!
  ) {
  createVehicle(
    vin: $vin
  ) {
    id,
    vin,
    owner{
    username,
    email
    }
  }
 }
`;

const CreateVehicle = () => {
    const [formState, setFormState] = useState({
        vin: '',
    });
    const navigate = useNavigate();

    const [createVehicle] = useMutation(CREATE_VEHICLE_MUTATION, {
        variables: {
            vin: formState.vin,
        },
        onCompleted: () => navigate('/vehicles')
    });

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createVehicle();
                }}
            >
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={formState.vin}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                vin: e.target.value.toUpperCase()
                            })
                        }
                        type="text"
                        placeholder="A vehicle vin"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateVehicle;