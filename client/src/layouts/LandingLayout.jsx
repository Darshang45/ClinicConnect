import React from 'react';

import Navbar from '../pages/landing/navbar/Navbar';
import Footer from '../pages/landing/footer/Footer';


import Hero from "../pages/landing/hero/Hero";
import ClinicalExcellence from "../pages/landing/clinical/ClinicalExcellence";
import About from "../pages/landing/about/About";
import FeaturedDoctors from "../pages/landing/featured_doctors/FeaturedDoctors";
import Doctors from "../pages/landing/doctors/Doctors";
import Departments from "../pages/landing/departments/Departments";
import Appointment from "../pages/landing/appointment/Appointment";
import Journey from "../pages/landing/journey/Journey";
import Facilities from "../pages/landing/facilities/Facilities";
import Testimonials from "../pages/landing/testimonials/Testimonials";
import FAQ from "../pages/landing/faq/FAQ";
import Contact from "../pages/landing/contact/Contact";

function LandingPage() {
  return (
    <>
      <Navbar/>
      <Hero />
      <ClinicalExcellence />
      <About />
      <FeaturedDoctors />
      <Doctors />
      <Departments />
      <Appointment />
      <Journey />
      <Facilities />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}

export default LandingPage;