import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function BackButton({ className = "", to }) {
  const navigate = useNavigate();

  return (
    <button
      className={`btn btn-outline ${className}`.trim()}
      onClick={() => navigate(to)}
      type="button"
    >
      <FiArrowLeft />
      Back
    </button>
  );
}

export default BackButton;
