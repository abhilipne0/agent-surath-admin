import React from 'react';
import { Modal, Button } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddAgentForm({ visible, onClose, onSave, initialValues }) {
    const isEdit = !!initialValues;

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        mobile: Yup.string()
            .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
            .required('Mobile number is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .test(
                'password-required',
                'Password is required',
                function (value) {
                    // 'this.options.context' can pass isEdit flag from Formik
                    const { isEdit } = this.options.context || {};
                    if (!isEdit && !value) return false; // require password on create
                    return true;
                }
            ),
        coin_percentage: Yup.number()
            .min(1, 'Minimum 1%')
            .max(100, 'Maximum 100%')
            .required('Coin percentage is required'),
        location: Yup.string().required('Location is required'),
        status: Yup.string().oneOf(['Active', 'Inactive']).required('Status is required'),
        coin_refundable: Yup.string().oneOf(['Yes', 'No']).required('Select coin refundable'),
    });

    const defaultValues = initialValues || {
        name: '',
        mobile: '',
        email: '',
        password: '',
        coin_percentage: 50,
        location: '',
        status: 'Active',
        coin_refundable: 'Yes',
    };

    return (
        <Modal
            title={isEdit ? "Edit Agent" : "Add Agent"}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={defaultValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onSave(values);
                }}
            >
                {({ values, setFieldValue, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Name</label>
                            <Field name="name" className="form-control" />
                            <div className="text-danger"><ErrorMessage name="name" /></div>
                        </div>

                        <div className="mb-3">
                            <label>Mobile Number</label>
                            <Field name="mobile" className="form-control" />
                            <div className="text-danger"><ErrorMessage name="mobile" /></div>
                        </div>

                        <div className="mb-3">
                            <label>Email</label>
                            <Field name="email" className="form-control" />
                            <div className="text-danger"><ErrorMessage name="email" /></div>
                        </div>

                        <div className="mb-3">
                            <label>Password {isEdit ? '(Leave blank to keep current password)' : ''}</label>
                            <Field type="text" name="password" className="form-control" />
                            <div className="text-danger"><ErrorMessage name="password" /></div>
                        </div>

                        <div className="mb-3">
                            <label>Coin Percentage (1-100)</label>
                            <Field type="number" name="coin_percentage" className="form-control" />
                            <div className="text-danger"><ErrorMessage name="coin_percentage" /></div>
                        </div>

                        <div className="mb-3">
                            <label>Location</label>
                            <Field name="location" className="form-control" />
                            <div className="text-danger"><ErrorMessage name="location" /></div>
                        </div>

                        <div className="mb-3 form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="statusSwitch"
                                checked={values.status === 'Active'}
                                onChange={(e) => setFieldValue('status', e.target.checked ? 'Active' : 'Inactive')}
                            />
                            <label className="form-check-label" htmlFor="statusSwitch">
                                Active / Inactive
                            </label>
                        </div>

                        <div className="mb-3">
                            <label>Coin is Refundable</label>
                            <Field as="select" name="coin_refundable" className="form-select">
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Field>
                            <div className="text-danger"><ErrorMessage name="coin_refundable" /></div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <Button type="default" onClick={onClose} className="me-2">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {isEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default AddAgentForm;
