import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import {gql, useMutation} from "@apollo/client";
import {SPARES_QUERY} from "./SpareList";

const UPDATE_SPARE_MUTATION = gql`
  mutation UpdateSpareMutation(
    $id: Int!
    $name: String! 
    $count: Int!
    $cost: Float!
  ) {
  updateSpare(input: 
    {
        id: $id
        name: $name
        count: $count
        cost: $cost 
    }
  ){
    spare{
       id
       name
       cost
       count
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
const SparesTable = ({dataTable}) => {
    let preparedData = [];
    if (dataTable) {
        // eslint-disable-next-line react/prop-types
        preparedData = dataTable.edges.map(item => {
            item = item.node;
            return {
                ...item,
                createdDate: item.createdDate.split('T')[0],
                authorName: `${item.createdBy.firstName} ${item.createdBy.lastName}`,
                key: item.id
            }
        })
    }

    const [updateSpare, { loading, error }] = useMutation(UPDATE_SPARE_MUTATION, {
        update: (cache, {data}) => {
            const cached_data = cache.readQuery({
                query: SPARES_QUERY,
            });

            if (data && cached_data){
                cache.writeQuery({
                    query: SPARES_QUERY,
                    data: {
                        spares: {
                            edges: [data.updateSpare.spare, ...cached_data.spares.edges]
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

    const [sortedInfo, setSortedInfo] = useState({});
    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    const [form] = Form.useForm();
    const [data, setData] = useState(preparedData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            date: '',
            name: '',
            count: '',
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

                updateSpare(
                    {
                        variables: {
                            id: key,
                            name: newData[index].name,
                            count: newData[index].count,
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
            key: 'date',
            width: '15%',
            editable: false,
            sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
            sortOrder: sortedInfo.columnKey === 'date' ? sortedInfo.order : null,
        },
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            editable: true,
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        },
        {
            title: 'count',
            dataIndex: 'count',
            key: 'count',
            width: '15%',
            editable: true,
            sorter: (a, b) => a.count - b.count,
            sortOrder: sortedInfo.columnKey === 'count' ? sortedInfo.order : null,
        },
        {
            title: 'cost',
            dataIndex: 'cost',
            key: 'cost',
            width: '15%',
            editable: true,
            sorter: (a, b) => a.cost - b.cost,
            sortOrder: sortedInfo.columnKey === 'cost' ? sortedInfo.order : null,
        },
        {
            title: 'author',
            dataIndex: 'authorName',
            key: 'author',
            width: '30%',
            editable: false,
            sorter: (a, b) => a.authorName.length - b.authorName.length,
            sortOrder: sortedInfo.columnKey === 'author' ? sortedInfo.order : null,
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
                inputType: ['name', 'author'].indexOf(col.dataIndex) !== -1 ? 'text' : 'number',
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
                onChange={handleChange}
            />
        </Form>
    );
};
export default SparesTable;
