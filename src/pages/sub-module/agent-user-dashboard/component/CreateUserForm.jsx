import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, message, Switch } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import { createAgentUser, getagentUsers, updateAgentUser } from "../../../../store/agents/agentsSlice";
import { unwrapResult } from "@reduxjs/toolkit";

// Validation schema
const UserSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Name is required"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    status: Yup.boolean(),
});

const CreateUserForm = ({ onClose, user }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // Determine if form is in edit mode
    const isEdit = !!user;

    const initialValues = {
        name: user?.name || "",
        phone: user?.phone || "",
        password: user?.password || "", // keep empty for edit; user can change if needed
        status: user?.status ?? true,
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setLoading(true);

            let action;
            let successMsg = "";
            let errorMsg = "";

            if (isEdit) {
                action = updateAgentUser({ userId: user._id, data: values });
                successMsg = "User updated successfully!";
                errorMsg = "Failed to update user.";
            } else {
                action = createAgentUser(values);
                successMsg = "User created successfully!";
                errorMsg = "Failed to create user.";
            }

            // Dispatch and unwrap result
            const result = await dispatch(action).then(unwrapResult);

            // If successful
            message.success(successMsg);
            dispatch(getagentUsers());

            onClose();
        } catch (err) {
            console.error(err);
            message.error(err?.message || err || errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Formik initialValues={initialValues} validationSchema={UserSchema} onSubmit={handleSubmit} enableReinitialize>
            {({ errors, touched, values, setFieldValue }) => (
                <Form>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <Field
                            name="name"
                            type="text"
                            placeholder="Enter name"
                            className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage component="div" name="name" className="invalid-feedback" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <Field
                            name="phone"
                            type="text"
                            placeholder="Enter phone"
                            className={`form-control ${errors.phone && touched.phone ? "is-invalid" : ""}`}
                            disabled={isEdit} // don't allow changing phone when editing
                        />
                        <ErrorMessage component="div" name="phone" className="invalid-feedback" />
                    </div>

                    {!isEdit && (
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <Field
                                name="password"
                                type="text"
                                placeholder="Enter password"
                                className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                            />
                            <ErrorMessage component="div" name="password" className="invalid-feedback" />
                        </div>
                    )}

                    {isEdit && (
                        <div className="mb-3">
                            <label className="form-label">Change Password (Optional)</label>
                            <Field
                                name="password"
                                type="text"
                                placeholder="Enter new password"
                                className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                            />
                            <ErrorMessage component="div" name="password" className="invalid-feedback" />
                        </div>
                    )}

                    <div className="mb-3 d-flex align-items-center">
                        <label className="form-label me-2">Status</label>
                        <Switch
                            checked={values.status}
                            onChange={(checked) => setFieldValue("status", checked)}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
                    </div>

                    <div className="text-center">
                        <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                            {isEdit ? "Update User" : "Create User"}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CreateUserForm;
