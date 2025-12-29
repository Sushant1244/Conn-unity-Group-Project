import React from 'react';
import './ErrorOverlay.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null, globalErrors: [] };
    this.onGlobalError = this.onGlobalError.bind(this);
  }

  componentDidMount() {
    window.addEventListener('error', this.onGlobalError);
    window.addEventListener('unhandledrejection', this.onGlobalError);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.onGlobalError);
    window.removeEventListener('unhandledrejection', this.onGlobalError);
  }

  onGlobalError(ev) {
    const message = ev?.reason?.message || ev?.message || (ev && ev.reason) || String(ev);
    this.setState((s) => ({
      globalErrors: [...s.globalErrors, message]
    }));
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // still log to console
    console.error('Caught by ErrorBoundary:', error, info);
  }

  render() {
    const { hasError, error, info, globalErrors } = this.state;
    if (hasError || globalErrors.length) {
      return (
        <div className="error-overlay">
          <div className="error-header">Application error</div>
          {error && (
            <div className="error-block">
              <h3>Error:</h3>
              <pre>{String(error && (error.message || error))}</pre>
              {info && <pre>{info.componentStack}</pre>}
            </div>
          )}
          {globalErrors.length > 0 && (
            <div className="error-block">
              <h3>Global errors / promises:</h3>
              <ul>
                {globalErrors.map((e, i) => (
                  <li key={i}><pre>{String(e)}</pre></li>
                ))}
              </ul>
            </div>
          )}
          <div className="error-footer">Check developer console for full stack.</div>
        </div>
      );
    }

    return this.props.children || null;
  }
}

export default ErrorBoundary;
