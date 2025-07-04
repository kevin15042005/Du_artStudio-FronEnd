import React from "react";
import Layout from "../../Components/layout/index.jsx";
import Footer from "../../Components/Footer/footer.jsx";
import "./Nosotros.css";
import ScrollAnimation from"../../Components/ScrollAnimationNosotros/index.jsx"
export default function Ubicacion() {
  return (
    <div id="main-container">
      <Layout />
      <div className="Menu-Ubicacion">
        <div className="InformacioNosotros">
          <section className="Menu-Mision">
            <ScrollAnimation>
            <h2>Mision</h2>
            <p className="MisionP activo">
             Somos una microempresa especializada en la
              personalización y pintura de motocicletas, ofreciendo diseños
              exclusivos y personalizados para cada cliente.Este sitio web
              permitirá a DUART-STUDIO no solo promocionar sus productos de
              manera eficiente, fortalecer su presencia en un entorno digital,
              mejorar la experiencia del usuario y potenciar sus oportunidades
              de comercialización de personalización y pintura en la ciudad de
              Bogotá en el año 2025, con la finalidad de satisfacer al cliente.{" "}
            </p>
            </ScrollAnimation>
          </section>
          <section className="Menu-Vision">
            <h2>Vision</h2>
            <ScrollAnimation>

            <p className="VisionP activo">
              Consolidarnos en Bogotá en el año 2026-1 con mayor relevancia en
              el mercado, tanto en la personalización de motos como en
              accesorios de motocicletas, incluyendo textiles. Aspiramos a
              lograr un gran posicionamiento en el sector de la personalización
              y pintura, integrando soluciones digitales que impulsen nuestro
              crecimiento y mejoren la relación con los clientes y los servicios
              ofrecidos.{" "}
            </p>
            </ScrollAnimation>
          </section>
         
                      <h2>Nuestra Ubicacion</h2>

          <section className="Ubicacion">
            <p>
              Nos encontramos ubicados en la ciudad Bogota D.C Colombia nos
              establecimos aqui por el gran comercio e inspiracion a la gran
              mayoria de motocilcetas es una de las ciudades con mayor cantidad
              de motos en Colombia{" "}
            </p>
          </section>

          <div className="contenedor-horario-ubicaicon">
            <div className="Horario">
              <h2>Horario</h2>
              <p>De lunes a Sabado de 9:00 am a 6:00 pm</p>
            </div>

            <div className="ubicacionMaps">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15908.15966063447!2d-74.16315452327753!3d4.586858863649104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9f23409b4f75%3A0xef8a79a5e02535a9!2sDU-ART%20STUDIO!5e0!3m2!1ses-419!2sco!4v1742415082521!5m2!1ses-419!2sco"
                width="700"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                alt="Ubicacion de Empresa"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
