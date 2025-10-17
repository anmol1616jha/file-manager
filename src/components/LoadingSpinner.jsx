const LoadingSpinner = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px', padding: '40px' },
  spinner: { width: '50px', height: '50px', border: '4px solid #F3F4F6', borderTop: '4px solid #6C5CE7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  text: { marginTop: '20px', color: '#9CA3AF', fontSize: '15px', fontWeight: '500' },
};

if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    try {
      styleSheet.insertRule('@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', styleSheet.cssRules.length);
    } catch (e) {}
  }
}

export default LoadingSpinner;
