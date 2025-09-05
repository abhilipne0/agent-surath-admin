import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BankOutlined, ContainerOutlined, DashboardOutlined, FallOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname;

  const role = localStorage.getItem('role'); // 'admin' or 'agent'

  const menuItems = [
    { key: '/agents', icon: <BankOutlined />, label: 'Agent Panel' },
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/summary', icon: <ContainerOutlined />, label: 'Surath' },
    { key: '/surath-dash', icon: <DashboardOutlined />, label: 'Session Info' },
    { key: '/agent/dashboard', icon: <DashboardOutlined />, label: 'A. Dashboard' },
    { key: '/agent/user', icon: <DashboardOutlined />, label: 'A. User' },
  ];

  // Filter menu items based on role
  const filteredItems = role === 'admin'
    ? menuItems
    : menuItems.filter((item) =>
      item.key === '/agent/dashboard' || item.key === '/agent/user'
    ); // agent sees only these two

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const handleMenuClick = (key) => {
    navigate(key);
    setCollapsed(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminMobile');
    localStorage.removeItem('role');
    localStorage.removeItem('agent');
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Roboto', sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 25px',
        height: '60px',
        backgroundColor: '#3a506b',
        color: '#fff',
        fontWeight: '600',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={toggleCollapsed}
            style={{ fontSize: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', transition: '0.3s' }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <span style={{ fontSize: '18px' }}>Admin Panel</span>
        </div>
        <button
          onClick={handleLogOut}
          style={{
            backgroundColor: '#ff6b6b',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '500',
            transition: '0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#ff8787')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff6b6b')}
        >
          Logout
        </button>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: collapsed ? '0' : '240px',
            overflow: 'hidden',
            backgroundColor: '#f0f4f8',
            transition: 'width 0.4s ease',
            boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          }}
        >
          <ul style={{ listStyle: 'none', padding: '25px', margin: 0 }}>
            {filteredItems.map((item) => (
              <li key={item.key} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => handleMenuClick(item.key)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 15px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: selectedKey === item.key ? '#3a506b' : 'transparent',
                    color: selectedKey === item.key ? '#fff' : '#3a506b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = selectedKey === item.key ? '#3a506b' : '#d1d9e6')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = selectedKey === item.key ? '#3a506b' : 'transparent')}
                >
                  {item.icon} {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: '25px',
            background: '#cad1d6ff',
            overflowY: 'auto',
            transition: 'margin-left 0.4s ease',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
