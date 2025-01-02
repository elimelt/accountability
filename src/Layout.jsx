import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-content">
          <a href="https://elimelt.com" className="nav-logo">template</a>
          <div className="nav-links">
            <a href="/" className="nav-link">/home</a>
          </div>
        </div>
      </nav>

      <main className="content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://elimelt.com" className="footer-link">/portfolio</a>
          <a href="https://github.com/elimelt" className="footer-link">/github</a>
          <a href="https://gist.github.io/elimelt" className="footer-link">/gists</a>
          <a href="https://linkedin.com/in/elimelt" className="footer-link">/linkedin</a>
        </div>
        <div className="footer-credit">elijah melton</div>
      </footer>
    </div>
  );
}