import React from 'react';
import './footer.css';

const Footer = () => (
  <div className="footer">
    <div className="footer-links">
      <a href="https://twitter.com/getdundun" className="footer-link" target="_blank" rel="noopener noreferrer">@getdundun</a>
      <a href="https://headwayapp.co/getdundun-com-changelog" className="footer-link" target="_blank" rel="noopener noreferrer">Release notes</a>
    </div>
    <span className="footer-copyright">&copy;{new Date().getFullYear()} 48 Made LLC.</span>
    <span className="footer-emoji" role="img" aria-label="peace">✌️</span>
  </div>
);

export default Footer;
