import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/details', label: 'Detail List', icon: '📋' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>📁</div>
        <div style={styles.logoText}>File Manager</div>
      </div>
      
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <button key={item.path} onClick={() => navigate(item.path)} style={{ ...styles.navItem, ...(location.pathname === item.path ? styles.navItemActive : {}) }}>
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  sidebar: { width: '70px', backgroundColor: '#6C5CE7', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', boxShadow: '2px 0 10px rgba(0,0,0,0.1)', minHeight: '100vh' },
  logo: { textAlign: 'center', marginBottom: '40px', color: 'white' },
  logoIcon: { fontSize: '32px', marginBottom: '8px' },
  logoText: { fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: '1.2' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', padding: '0 10px' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '10px' },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' },
  navIcon: { fontSize: '24px', marginBottom: '4px' },
  navLabel: { fontSize: '10px', fontWeight: '500', textAlign: 'center' },
};

export default Sidebar;
