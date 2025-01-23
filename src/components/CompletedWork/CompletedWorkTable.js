import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import {gql, useMutation} from "@apollo/client";
import {COMPLETED_WORK_QUERY} from "./CompletedWorkList";


const UPDATE_COMPLETED_WORK_MUTATION = gql`
  mutation UpdateCompletedWorkMutation(
    $id: Int!
    $name: String! 
    $hours: Int!
    $cost: Float!
  ) {
  updateCompletedWork(input: 
    {
        id: $id
        name: $name
        hours: $hours
        cost: $cost 
    }
  ){
    completedWork{
       id
       name
       cost
       hours
       createdBy{
        firstName
        lastName
       }
       createdDate
    }
   }
  }
`;


const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

// eslint-disable-next-line react/prop-types
const CompletedWorkTable = ({dataTable}) => {

    const [updateCompleteWork, { loading, error }] = useMutation(UPDATE_COMPLETED_WORK_MUTATION, {
        update: (cache, {data}) => {
            const cached_data = cache.readQuery({
                query: COMPLETED_WORK_QUERY,
            });

            if (data && cached_data){
                cache.writeQuery({
                    query: COMPLETED_WORK_QUERY,
                    data: {
                        spares: {
                            edges: [data.updateCompleteWork.completedWork, ...cached_data.completedWorkList.edges]
                        }
                    }
                })
            }

        },
        onCompleted: ({errors}) => {
            if (errors) {
                console.log(errors);
            }
        }
    });

    const [form] = Form.useForm();
    const [data, setData] = useState(dataTable);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            date: '',
            name: '',
            hours: '',
            cost: '',
            author: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                updateCompleteWork(
                    {
                        variables: {
                            id: key,
                            name: newData[index].name,
                            hours: newData[index].hours,
                            cost: newData[index].cost,
                        }
                    })
                if (error) {
                    console.log(error);
                    setEditingKey('');
                }
                else {
                    setData(newData);
                    setEditingKey('');
                }

            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'date',
            dataIndex: 'createdDate',
            width: '15%',
            editable: false,
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'hours',
            dataIndex: 'hours',
            width: '15%',
            editable: true,
        },
        {
            title: 'cost',
            dataIndex: 'cost',
            width: '15%',
            editable: true,
        },
        {
            title: 'author',
            dataIndex: 'authorName',
            width: '30%',
            editable: false,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link
                onClick={() => save(record.key)}
                style={{
                    marginInlineEnd: 8,
                }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'name' ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
};
export default CompletedWorkTable;
