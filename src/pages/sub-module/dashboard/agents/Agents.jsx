import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Statistic, Spin, Badge, Button, message, Tag, Modal } from 'antd';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddAgentForm from './component/AddAgentForm';
import { useDispatch, useSelector } from 'react-redux';
import { createAgent, editAgent, fetchAgents } from '../../../../store/agents/agentsSlice';
import AgentFundTransactionForm from './component/AgentFundTransactionForm';

function Agents() {

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [fundModalVisible, setFundModalVisible] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const { agents } = useSelector((state) => state.agent)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAgents({ page: 1, limit: 10 }));
    }, [])

    const handleOpenModal = (agent = null) => {
        setEditingAgent(agent);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setEditingAgent(null);
        setModalVisible(false);
    };

    const handleFundTransaction = (agent) => {
        setSelectedAgent(agent);
        setFundModalVisible(true);
    };

    const handleSaveAgent = async (agentData) => {
        try {
            if (agentData.agent_id) {
                // Existing agent -> update
                await dispatch(editAgent({ agentId: agentData.agent_id, updateData: agentData })).unwrap();
                message.success('Agent updated successfully');
            } else {
                // New agent -> create
                await dispatch(createAgent(agentData)).unwrap();
                message.success('Agent added successfully');
            }

            handleCloseModal();
            // Refresh agent list after create/update
            dispatch(fetchAgents({ page: 1, limit: 10 }));
        } catch (err) {
            console.error(err);
            message.error(err.message || 'Something went wrong');
        }
    };

    const columns = [
        { title: 'Agent ID', dataIndex: 'agent_id', key: 'agent_id', fixed: 'left' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Mobile', dataIndex: 'mobile', key: 'mobile' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Coin %', dataIndex: 'coin_percentage', key: 'coin_percentage' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'} style={{ fontWeight: 'bold' }}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Coin Refundable',
            dataIndex: 'coin_refundable',
            key: 'coin_refundable',
            render: (refundable) => (
                <Tag color={refundable === 'Yes' ? 'green' : 'gray'} style={{ fontWeight: 'bold' }}>
                    {refundable}
                </Tag>
            )
        },
        { title: 'Total Users', dataIndex: 'total_users', key: 'total_users' },
        { title: 'Coins Balance', dataIndex: 'coins_balance', key: 'coins_balance' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
        { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="d-flex gap-2">
                    <Button size="small" type="default" onClick={() => handleOpenModal(record)}>
                        Edit
                    </Button>
                    <Button type="primary" size="small" onClick={() => handleFundTransaction(record)}>
                        Fund Transaction
                    </Button>
                </div>
            ),
            fixed: 'right'
        }
    ];

    return (
        <div className="containe mt-4">

            <div className="row">
                <div className="col-sm-6">
                    <Row justify="center" className='text-center' gutter={40}>
                        <Col>
                            <Statistic title="Total Agents" value={agents.length} />
                        </Col>
                        <Col>
                            <Statistic
                                title="Total Coins in System"
                                value={agents.reduce((sum, a) => sum + a.coins_balance, 0)}
                            />
                        </Col>
                    </Row>


                    <div className="mb-3 text-center">
                        <Button type="primary" onClick={() => handleOpenModal()}>
                            Add Agent
                        </Button>
                    </div>

                    <Spin spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={agents}
                            className='custom-table'
                            rowKey="agent_id"
                            size="middle"
                            scroll={{ x: 'max-content' }}
                            pagination={{ pageSize: 10 }}
                        />
                    </Spin>

                </div>
                <div className="col-sm-6">

                </div>
            </div>

            {/* Modal Form */}
            {modalVisible && (
                <AddAgentForm
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    onSave={handleSaveAgent}
                    initialValues={editingAgent}
                />
            )}
            {fundModalVisible && selectedAgent && (
                <Modal
                    title={`Fund Transaction - ${selectedAgent.name}`}
                    open={fundModalVisible}
                    onCancel={() => {
                        setSelectedAgent(null);
                        setFundModalVisible(false);
                    }}
                    footer={null}
                    centered
                    destroyOnClose
                >
                    <AgentFundTransactionForm
                        agent={selectedAgent}
                        onClose={() => {
                            setSelectedAgent(null);
                            setFundModalVisible(false);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}

export default Agents;
