import React from "react";
import { Form, InputNumber, Button, Select, Typography, Divider, message } from "antd";
import { useDispatch } from "react-redux";
import { getagentUsers, transactionHistory, updateUserFund } from "../../../../store/agents/agentsSlice";

const { Text } = Typography;

function FundTransactionForm({ user, onClose }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { amount, type } = values;

        try {
            await dispatch(updateUserFund({ userId: user._id, amount, type })).unwrap();
            console.log("step 1")
            dispatch(getagentUsers());
            console.log("step 2")
            dispatch(transactionHistory());
            console.log("step 3")
            onClose();
            message.success("Fund updated successfully!");
        } catch (error) {
            message.error(error?.message || "Failed to update fund.");
        }
    };

    return (
        <>
            {/* Current Balance Display */}
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <Text strong>
                    User Balance:{" "}
                    <Text type="success">{user?.availableBalance?.toFixed(2) || 0}</Text>
                </Text>
            </div>
            <Divider />

            {/* Transaction Form */}
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="Transaction Type"
                    name="type"
                    rules={[{ required: true, message: "Please select transaction type" }]}
                >
                    <Select placeholder="Select transaction type">
                        <Select.Option value="add">Add Fund</Select.Option>
                        <Select.Option value="remove">Minus Fund</Select.Option>
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
        </>
    );
}

export default FundTransactionForm;
