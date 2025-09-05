import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag } from "antd";
import { userTransactionHistory } from "../../../../store/agents/agentsSlice";

function Transaction() {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const { userTransactions, userTransactionsPagination, loading } = useSelector(
        (state) => state.agent
    );

    useEffect(() => {
        dispatch(userTransactionHistory({ userId, page: 1, limit: 10 }));
    }, [dispatch, userId]);

    const handlePageChange = (page, pageSize) => {
        dispatch(userTransactionHistory({ userId, page, limit: pageSize }));
    };

    const columns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "deposit" ? "green" : type === "withdraw_request" ? "red" : "blue"}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Game",
            dataIndex: "gameId",
            key: "gameId",
            width: 100,
            render: (game) => game || "-",
        },
        {
            title: "Card",
            dataIndex: "card",
            key: "card",
            render: (card) => card || "-",
            width: 100,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (amount) => `₹${amount}`,
        },
        {
            title: "Wallet Before",
            dataIndex: "walletBefore",
            key: "walletBefore",
            width: 100,
        },
        {
            title: "Wallet After",
            dataIndex: "walletAfter",
            key: "walletAfter",
            width: 100,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "success" ? "green" : "volcano"}>{status}</Tag>
            ),
        },
        {
            title: "Date",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (time) => new Date(time).toLocaleString(),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h3>User Transactions</h3>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={userTransactions}
                loading={loading}
                pagination={{
                    current: userTransactionsPagination.page,
                    pageSize: userTransactionsPagination.limit,
                    total: userTransactionsPagination.total,
                    onChange: handlePageChange,
                }}

                scroll={{ x: "max-content", y: 400 }}// fixed height + scroll
            />
        </div>
    );
}

export default Transaction;
