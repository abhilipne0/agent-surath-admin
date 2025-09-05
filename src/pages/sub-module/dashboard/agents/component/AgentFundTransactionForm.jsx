import React from "react";
import { Form, InputNumber, Button, Select } from "antd";
import { useDispatch } from "react-redux";
import { createAgentTransaction, fetchAgents } from "../../../../../store/agents/agentsSlice";
// import { adminAgentFundTransaction } from "../../../../store/agents/agentsSlice";

function AgentFundTransactionForm({ agent, onClose }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        try {
            const { amount, type } = values;

            // unwrap makes it throw error if rejected
            await dispatch(createAgentTransaction({
                agentId: agent._id,
                type,
                amount
            })).unwrap();

            // only runs on success
            await dispatch(fetchAgents({ page: 1, limit: 10 }));

            onClose();
        } catch (err) {
            console.error("Transaction failed:", err);
        }
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                label="Transaction Type"
                name="type"
                rules={[{ required: true, message: "Please select transaction type" }]}
            >
                <Select>
                    <Select.Option value="add">Add Coins</Select.Option>
                    <Select.Option value="remove">Remove Coins</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please enter amount" }]}
            >
                <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

export default AgentFundTransactionForm;
