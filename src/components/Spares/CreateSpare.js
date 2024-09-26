import React, {useState} from 'react';
import {useMutation, gql} from '@apollo/client';

const CREATE_SPARE_MUTATION = gql`
    mutation PostMutation($name: String!, $count: Int!, $cost: Float!){
        createSpares(input: { name: $name, count: $count, cost: $cost }){
            spare {
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
`;

const CreateSpare = () => {
    const [formState, setFormState] = useState({
        name: '',
        count: '',
        cost: '',
    });
    const [errorSuccessMessages, setErrorSuccessMesages] = useState([]);

    const [createSpares] = useMutation(CREATE_SPARE_MUTATION, {
        variables: {
            name: formState.name,
            count: formState.count,
            cost: formState.cost,
        },

        onCompleted: ({createSpares, errors}) => {
            if (errors) {
                let errorList = errors.nonFieldErrors.map((item) => item.message);
                setErrorSuccessMesages(errorList);
            } else {
                setErrorSuccessMesages(['Success!', `Spare with name: ${createSpares.spare.name} successfully created.`])

                setFormState({
                    name: '',
                    count: '',
                    cost: '',
                })
            }

        }
    });

    return (
        <div>
            {errorSuccessMessages.map((error, index) => <p key={index}>{error}</p>)}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createSpares();
                }}
            >
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={formState.name}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                name: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Input spare name..."
                    />
                    <input
                        className="mb2"
                        value={formState.count}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                count: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Input spare count..."
                    />
                    <input
                        className="mb2"
                        value={formState.cost}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                cost: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Input spare cost.."
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateSpare;
