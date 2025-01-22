import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import short from "short-uuid";
import {COMPLETED_WORK_QUERY} from "./CompletedWorkList";

const CREATE_COMPLETED_WORK_MUTATION = gql`
  mutation CreateCompletedWorkMutation(
    $name: String! 
    $hours: Int!
    $cost: Float!
  ) {
  createCompletedWork(input: 
    { 
        name: $name, 
        hours: $hours, 
        cost: $cost 
    }
  ){
    completedWork{
       name
       cost
       hours
       createdDate
    }
   }
  }
`;


const CreateCompletedWork = () => {
    const [errorMessages, setErrorMessages] = useState([]);

    const [formState, setFormState] = useState({
        name: '',
        hours: '',
        cost: '',
    });

    const [createSpare] = useMutation(CREATE_COMPLETED_WORK_MUTATION, {
        variables: {
            name: formState.name,
            hours: formState.hours,
            cost: formState.cost,
        },
        update: (cache, {data}) => {
            const cached_data = cache.readQuery({
                query: COMPLETED_WORK_QUERY,
            });
            if (data) {
                console.log(cached_data);
                console.log(data);
                cache.writeQuery({
                    query: COMPLETED_WORK_QUERY,
                    data: {
                        completedWorkList: {
                            edges: [{id: short.generate(), ...data.createCompletedWork.completedWork}, ...cached_data.completedWorkList.edges]
                        }
                    }
                })
            }

        },
        onCompleted: ({createCompletedWork, errors}) => {
            if (errors) {
                let errorList = errors.nonFieldErrors.map((item) => item.message);
                setErrorMessages(errorList);
            } else {
                setErrorMessages(['Success!', `Completed Work with name: ${createCompletedWork.completedWork.name} successfully added.`])

                setFormState({
                    name: '',
                    cost: '',
                    hours: ''
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
                        placeholder="Replacing the oil filter"
                    />
                    <input
                        className="mb2"
                        value={formState.hours}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                hours: e.target.value
                            })
                        }
                        type="text"
                        placeholder="1"
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
                        placeholder="24"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateCompletedWork;
