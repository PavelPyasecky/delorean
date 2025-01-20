import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import {SPARES_QUERY} from "./SpareList";
import short from "short-uuid";

const CREATE_SPARE_MUTATION = gql`
  mutation CreateSpareMutation(
    $name: String! 
    $count: Int!
    $cost: Float!
  ) {
  createSpares(input: 
    { 
        name: $name, 
        count: $count, 
        cost: $cost 
    }
  ){
    spare{
       name
       cost
       count
       createdDate
    }
   }
  }
`;


const CreateSpare = () => {
    const [errorMessages, setErrorMessages] = useState([]);

    const [formState, setFormState] = useState({
        name: '',
        count: '',
        cost: '',
    });

    const [createSpare] = useMutation(CREATE_SPARE_MUTATION, {
        variables: {
            name: formState.name,
            count: formState.count,
            cost: formState.cost,
        },
        update: (cache, {data}) => {
            const cached_data = cache.readQuery({
                query: SPARES_QUERY,
            });
            if (data){
                console.log(cached_data);
                console.log(data);
                cache.writeQuery({
                    query: SPARES_QUERY,
                    data: {
                        spares: {
                            edges: [{id: short.generate(),...data.createSpares.spare}, ...cached_data.spares.edges]
                        }
                    }
                })
            }

        },
        onCompleted: ({createSpares, errors}) => {
            if (errors) {
                let errorList = errors.nonFieldErrors.map((item) => item.message);
                setErrorMessages(errorList);
            } else {
                setErrorMessages(['Success!', `Spare with name: ${createSpares.spare.name} successfully added.`])

                setFormState({
                    name: '',
                    cost: '',
                    count: ''
                })
            }

        }
    });


    return (
        <div>
            {errorMessages.map((error, index) => <p key={index}>{error}</p>)}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createSpare();
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
                        placeholder="Brake pads"
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
                        placeholder="2"
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
                        placeholder="100"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateSpare;
