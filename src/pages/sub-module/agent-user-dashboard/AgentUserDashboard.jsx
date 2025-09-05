import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Tag } from "antd";
import CreateUserForm from "./component/CreateUserForm";
import { useDispatch, useSelector } from "react-redux";
import { getagentUsers, transactionHistory } from "../../../store/agents/agentsSlice";
import moment from "moment";
import FundTransactionForm from "./component/FundTransactionForm";
import { useNavigate } from "react-router-dom";

function AgentUserDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState(null);

    const dispatch = useDispatch();
    const { userList, loading, userPagination, transactions, transactionsPagination } = useSelector((state) => state.agent);

    // Local pagination state for transactions
    const [transactionPage, setTransactionPage] = useState(1);
    const [transactionPageSize, setTransactionPageSize] = useState(10);
    const [searchName, setSearchName] = useState("");

    // search + pagination states
    const [userSearch, setUserSearch] = useState("");
    const [userPage, setUserPage] = useState(1);
    const [userPageSize, setUserPageSize] = useState(10);

    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getagentUsers({ page: userPage, limit: userPageSize, search: userSearch }));
    }, [dispatch, userPage, userPageSize, userSearch]);

    // fetch transactions with pagination
    useEffect(() => {
        dispatch(transactionHistory({
            page: transactionPage,
            limit: transactionPageSize,
            userName: searchName // 🔎 pass userName filter
        }));
    }, [dispatch, transactionPage, transactionPageSize, searchName]);


    // User table columns
    const userColumns = [
        {
            title: "Username",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "User Mobile",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "User Balance",
            dataIndex: "availableBalance",
            key: "availableBalance",
            width: 100,
            render: (text) => (text ? text.toFixed(2) : "0.00"),
        },
        {
            title: "Is Active",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
        },
        {
            title: "Last Login",
            dataIndex: "lastLoginTime",
            key: "lastLoginTime",
            render: (date) => (date ? moment(date).format("DD/MM/YYYY HH:mm") : "Never"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="d-flex gap-2">
                    <Button type="default" size="small" onClick={() => handleEditUser(record)}>
                        Edit
                    </Button>
                    <Button type="primary" size="small" onClick={() => handleFundTransaction(record)}>
                        Fund Transaction
                    </Button>
                </div>
            ),
        },
        {
            title: "Transaction",
            key: "actions",
            render: (_, record) => (
                <div className="d-flex gap-2">
                    <Button type="primary" size="small" danger onClick={() => navigate(`/user/transaction/${record._id}`)}>
                        transaction
                    </Button>
                </div>
            ),
        }
    ];

    // Transactions table columns
    const transactionColumns = [
        {
            title: "User",
            key: "user",
            render: (record) => {
                if (record.userId) {
                    return record.userId.name; // if user exists
                }
                return (
                    <Tag color="blue" style={{ fontWeight: "bold" }}>
                        {record.createdBy}
                    </Tag>
                ); // fallback when userId is null
            },
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) =>
                type === "add" ? (
                    <Tag color="green">Add</Tag>
                ) : (
                    <Tag color="red">Remove</Tag>
                ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amt) => amt.toFixed(2),
        },
        {
            title: "User Balance",
            key: "userBalance",
            render: (record) => (
                <>
                    {record.userBalanceBefore?.toFixed(2)} →{" "}
                    {record.userBalanceAfter?.toFixed(2)}
                </>
            ),
        },
        {
            title: "Agent Balance",
            key: "agentBalance",
            render: (record) => (
                <>
                    {record.agentBalanceBefore?.toFixed(2)} →{" "}
                    {record.agentBalanceAfter?.toFixed(2)}
                </>
            ),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
        },
    ];

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setModalType("createUser");
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setModalType("createUser");
    };

    const handleFundTransaction = (user) => {
        setSelectedUser(user);
        setModalType("fund");
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="row">
                {/* Left - Users */}
                <div className="col-sm-6 text-center">
                    <Button type="primary" size="large" onClick={handleOpenModal}>
                        Create User
                    </Button>
                    <Input.Search
                        className="d-block"
                        placeholder="Search user by name"
                        allowClear
                        value={userSearch}
                        onChange={(e) => {
                            setUserPage(1); // reset pagination
                            setUserSearch(e.target.value);
                        }}
                        style={{ margin: "16px 0", width: '200px' }}
                    />
                    <Table
                        columns={userColumns}
                        dataSource={userList}
                        rowKey={(record) => record._id}
                        loading={loading}
                        pagination={{
                            current: userPagination?.page || userPage,
                            pageSize: userPagination?.limit || userPageSize,
                            total: userPagination?.total || 0,
                            onChange: (page, pageSize) => {
                                setUserPage(page);
                                setUserPageSize(pageSize);
                            },
                        }}
                        className="custom-table mt-2"
                        scroll={{ x: "max-content", y: 400 }}
                    />
                </div>

                {/* Right - Transactions */}
                <div className="col-sm-6">
                    <h4 className="text-center mb-4">Transactions</h4>
                    <Input.Search
                        placeholder="Search by user name"
                        allowClear
                        value={searchName}
                        onChange={(e) => {
                            setTransactionPage(1); // reset page when typing new search
                            setSearchName(e.target.value);
                        }}
                        style={{ marginBottom: 16, width: '200px' }}
                    />
                    <Table
                        columns={transactionColumns}
                        dataSource={transactions}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            current: transactionsPagination.page,
                            pageSize: transactionsPagination.limit,
                            total: transactionsPagination.total,
                            onChange: (page, pageSize) => {
                                setTransactionPage(page);
                                setTransactionPageSize(pageSize);
                            },
                        }}
                        scroll={{ x: "max-content", y: 400 }}
                    />
                </div>
            </div>

            {/* Modal for Create/Edit/Fund */}
            <Modal
                title={
                    modalType === "createUser"
                        ? (selectedUser ? "Edit User" : "Create New User")
                        : ""
                }
                open={isModalOpen}
                onCancel={() => {
                    setSelectedUser(null);
                    setModalType(null);
                    handleCloseModal();
                }}
                footer={null}
                centered
                destroyOnClose
            >
                {modalType === "createUser" && (
                    <CreateUserForm
                        onClose={() => {
                            setSelectedUser(null);
                            setModalType(null);
                            handleCloseModal();
                        }}
                        user={selectedUser}
                    />
                )}

                {modalType === "fund" && selectedUser && (
                    <FundTransactionForm
                        user={selectedUser}
                        onClose={() => {
                            setSelectedUser(null);
                            setModalType(null);
                            handleCloseModal();
                        }}
                    />
                )}
            </Modal>
        </>
    );
}

export default AgentUserDashboard;
