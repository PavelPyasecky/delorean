import React, {useState} from 'react';
import {useMutation, gql} from '@apollo/client';
import {VEHICLE_QUERY} from "./VehicleList";

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
    const [errorMesages, setErrorMesages] = useState([]);

    const [createVehicle] = useMutation(CREATE_VEHICLE_MUTATION, {
        variables: {
            vin: formState.vin,
        },
        update: (cache, {data}) => {
            const cached_data = cache.readQuery({
                query: VEHICLE_QUERY,
            });
            if (data){
                console.log(cached_data);
                console.log(data);
                cache.writeQuery({
                    query: VEHICLE_QUERY,
                    data: {
                        vehicle: [ data.createVehicle, ...cached_data.vehicle]
                    }
                })
            }

        },
        onCompleted: ({createVehicle, errors}) => {
            if (errors) {
                let errorList = errors.nonFieldErrors.map((item) => item.message);
                setErrorMesages(errorList);
            } else {
                setErrorMesages(['Success!', `Car with VIN: ${createVehicle.vin} successfully registered.`])

                setFormState({
                    vin: ''
                })
            }

        }
    });

    return (
        <div>
            {errorMesages.map((error, index) => <p key={index}>{error}</p>)}
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