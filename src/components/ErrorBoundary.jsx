import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button style={styles.button} onClick={() => window.location.href = '/'}>Return to Dashboard</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F5F6FA', padding: '20px' },
  card: { backgroundColor: 'white', padding: '48px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '500px', textAlign: 'center' },
  icon: { fontSize: '64px', marginBottom: '20px' },
  title: { color: '#EF4444', marginBottom: '16px', fontSize: '24px', fontWeight: '600' },
  message: { color: '#6B7280', marginBottom: '32px', fontSize: '15px', lineHeight: '1.6' },
  button: { padding: '12px 24px', backgroundColor: '#6C5CE7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' },
};

export default ErrorBoundary;
