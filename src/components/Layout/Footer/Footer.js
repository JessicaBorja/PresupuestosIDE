import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer__comp">
        <p>©2019 | Ingeniería y Diseño eléctrico S.A de C.V.</p>
        {/* <p>Aviso de privacidad | Terminos de uso</p> */}
      </div>
      <div className="footer__dev">
        <p>Desarrollado por:
          <a href="http://oscarrosete.com/" target="_blank" rel="noopener noreferrer" >
            {" Oscar Rosete "}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
