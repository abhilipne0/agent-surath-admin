import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../store/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(adminLogin(values))
        .unwrap()
        .then(() => navigate('/'))
        .catch(console.error);
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Roboto', sans-serif",
        background: '#0575E6', // fallback for old browsers
        backgroundImage: 'linear-gradient(to bottom, #021B79, #0575E6)', // main gradient
      }}
    >
      <div
        style={{
          width: '420px',
          padding: '50px 40px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          color: '#fff',
        }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <h2 style={{ fontWeight: 700, marginBottom: '10px' }}>Admin Login</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div className="form-group mb-4">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: '100%',
                padding: '14px 15px',
                borderRadius: '10px',
                border: 'none',
                outline: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '14px',
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="form-group mb-4 position-relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: '100%',
                padding: '14px 40px 14px 15px',
                borderRadius: '10px',
                border: 'none',
                outline: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '14px',
              }}
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
              style={{ position: 'absolute', top: '14px', right: '15px', cursor: 'pointer', color: '#fff', fontSize: '16px' }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              className="alert text-center"
              style={{
                background: 'rgba(255,0,0,0.2)',
                color: '#ff4d4f',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#021B79',
              color: '#fff',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#0575E6')}
            onMouseLeave={(e) => (e.target.style.background = '#021B79')}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <small style={{ color: 'rgba(255,255,255,0.7)' }}>© 2025 Your Company. All rights reserved.</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
