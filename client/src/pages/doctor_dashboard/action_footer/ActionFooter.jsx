import Button from "../../../components/common/Button";
import "../../../styles/doctor_dashboard.css";

function ActionFooter({
  onUpdateReception,
  onSaveDraft,
  onCompleteAndSend,
  loading = false,
}) {
  return (
    <section className="doc-action-footer">

      <div className="doc-utility-actions">

        <Button
          className="doc-utility-button"
          onClick={onUpdateReception}
        >
          <span className="material-symbols-outlined">
            edit_notifications
          </span>

          Update Reception
        </Button>

      </div>

      <div className="doc-primary-actions">

        <Button
          className="doc-save-button"
          onClick={onSaveDraft}
          disabled={loading}
        >
          <span className="material-symbols-outlined">
            save
          </span>

          Save Draft
        </Button>

        <Button
          className="doc-complete-button"
          onClick={onCompleteAndSend}
          disabled={loading}
        >
          <span className="material-symbols-outlined">
            send
          </span>

          Complete &amp; Send to Pharmacy
        </Button>

      </div>

    </section>
  );
}

export default ActionFooter;