import { useEffect, useRef } from "react";
import testimonial1 from "../../../assets/images/testimonials/testimonial-1.jpg";
import testimonial2 from "../../../assets/images/testimonials/testimonial-2.jpg";
import testimonial3 from "../../../assets/images/testimonials/testimonial-3.jpg";

const testimonials = [
  {
    id: 1,
    image: testimonial1,
    name: "Eleanor Vance",
    quote:
      '"The care I received at Clinic Connect was unparalleled. From the seamless digital check-in to the attentive cardiology team, everything was perfectly handled."',
  },
  {
    id: 2,
    image: testimonial2,
    name: "Arthur Sterling",
    quote:
      '"Modern medicine at its best. The facilities are incredible, more like a 5-star hotel than a clinic. The orthopedic surgeons are world-class."',
  },
  {
    id: 3,
    image: testimonial3,
    name: "Maya Rodriguez",
    quote:
      '"I love the patient portal. It\'s so easy to see my results and communicate with Dr. Chen. Clinic Connect has changed my perspective."',
  },
];

function Testimonials() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollAmount = 0;
    const interval = setInterval(() => {
      scrollAmount += 400;
      if (scrollAmount >= carousel.scrollWidth) scrollAmount = 0;
      carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-inner">
        <h2>Patient Voices</h2>
        <div className="testimonials-carousel hide-scroll" ref={carouselRef}>
          {testimonials.map((item) => (
            <div className="testimonial-card glass-card" key={item.id}>
              <div className="testimonial-header">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined filled">
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="testimonial-quote">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
