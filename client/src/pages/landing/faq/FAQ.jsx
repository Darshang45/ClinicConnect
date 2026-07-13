import { faqItems } from "../data/faq";

function FAQ() {
  return (
    <section className="faq" id="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqItems.map((item) => (
          <details className="faq-item" key={item.id} open={item.open}>
            <summary>
              {item.question}
              <span className="material-symbols-outlined">expand_more</span>
            </summary>
            <div className="faq-answer">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
