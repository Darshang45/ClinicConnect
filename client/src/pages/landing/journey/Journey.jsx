const desktopSteps = [
  { icon: "domain", title: "1. Choose Dept", description: "Find the right specialty for your needs." },
  { icon: "person_search", title: "2. Select Doctor", description: "Review profiles and pick your specialist." },
  { icon: "event_available", title: "3. Book", description: "Confirm your slot in seconds online." },
  { icon: "festival", title: "4. Visit", description: "Meet our experts in a luxury environment." },
  { icon: "healing", title: "5. Treatment", description: "Receive personalized care and recovery." },
];

const mobileSteps = [
  { step: 1, title: "Choose Department", description: "Identify your clinical needs easily." },
  { step: 2, title: "Select Doctor", description: "Top-tier experts at your fingertips." },
  { step: 3, title: "Instant Booking", description: "Simple digital scheduling 24/7." },
];

function Journey() {
  return (
    <section className="journey">
      <div className="journey-inner">
        <h2>Clinic Connect Journey</h2>

        <div className="journey-desktop">
          <div className="journey-line"></div>
          {desktopSteps.map((item) => (
            <div className="journey-step" key={item.title}>
              <div className="journey-step-icon">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="journey-mobile">
          {mobileSteps.map((item, index) => (
            <div key={item.step}>
              <div className="journey-mobile-item">
                <div className="journey-mobile-step">{item.step}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
              {index < mobileSteps.length - 1 && <div className="journey-mobile-line"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journey;
