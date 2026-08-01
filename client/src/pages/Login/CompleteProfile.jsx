import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initialProfile = {
  fullName: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  address: "",
  emergencyContact: {
    name: "",
    relation: "",
    phone: "",
  },
  allergies: "",
  chronicDiseases: "",
  insurance: {
    provider: "",
    policyNumber: "",
  },
};

const toList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function CompleteProfile({ onBack, onComplete }) {
  const { completePatientRegistration } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const updateNestedField = (section, field, value) => {
    setProfile((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      profile.fullName,
      profile.phone,
      profile.gender,
      profile.dateOfBirth,
      profile.bloodGroup,
      profile.address,
      profile.emergencyContact.name,
      profile.emergencyContact.relation,
      profile.emergencyContact.phone,
    ];

    if (requiredFields.some((value) => !value.trim())) {
      setError("Complete all required profile fields to continue.");
      return;
    }

    if (
      !/^\d{10}$/.test(profile.phone) ||
      !/^\d{10}$/.test(profile.emergencyContact.phone)
    ) {
      setError("Enter a valid 10-digit phone number for both contact fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await completePatientRegistration({
        ...profile,
        dob: profile.dateOfBirth,
        allergies: toList(profile.allergies),
        chronicDiseases: toList(profile.chronicDiseases),
      });

      onComplete();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "We could not complete your registration. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form complete-profile-form" onSubmit={handleSubmit}>
      <h4 className="profile-section-title">Personal Information</h4>
      <div className="login-field">
        <label className="login-label" htmlFor="full-name">
          Full Name
        </label>
        <input
          className="login-input"
          id="full-name"
          onChange={(event) => updateField("fullName", event.target.value)}
          required
          value={profile.fullName}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="phone">
          Phone Number
        </label>
        <input
          className="login-input"
          id="phone"
          inputMode="numeric"
          maxLength="10"
          onChange={(event) =>
            updateField("phone", event.target.value.replace(/\D/g, ""))
          }
          required
          value={profile.phone}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="gender">
          Gender
        </label>
        <select
          className="login-input"
          id="gender"
          onChange={(event) => updateField("gender", event.target.value)}
          required
          value={profile.gender}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="date-of-birth">
          Date of Birth
        </label>
        <input
          className="login-input"
          id="date-of-birth"
          onChange={(event) => updateField("dateOfBirth", event.target.value)}
          required
          type="date"
          value={profile.dateOfBirth}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="blood-group">
          Blood Group
        </label>
        <select
          className="login-input"
          id="blood-group"
          onChange={(event) => updateField("bloodGroup", event.target.value)}
          required
          value={profile.bloodGroup}
        >
          <option value="">Select blood group</option>
          {bloodGroups.map((bloodGroup) => (
            <option key={bloodGroup} value={bloodGroup}>
              {bloodGroup}
            </option>
          ))}
        </select>
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="address">
          Address
        </label>
        <textarea
          className="login-input"
          id="address"
          onChange={(event) => updateField("address", event.target.value)}
          required
          rows="3"
          value={profile.address}
        />
      </div>

      <h4 className="profile-section-title">Emergency Contact</h4>

      <div className="login-field">
        <label className="login-label" htmlFor="emergency-name">
          Emergency Contact Name
        </label>
        <input
          className="login-input"
          id="emergency-name"
          onChange={(event) =>
            updateNestedField("emergencyContact", "name", event.target.value)
          }
          required
          value={profile.emergencyContact.name}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="emergency-relation">
          Emergency Contact Relation
        </label>
        <input
          className="login-input"
          id="emergency-relation"
          onChange={(event) =>
            updateNestedField(
              "emergencyContact",
              "relation",
              event.target.value,
            )
          }
          required
          value={profile.emergencyContact.relation}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="emergency-phone">
          Emergency Contact Phone
        </label>
        <input
          className="login-input"
          id="emergency-phone"
          inputMode="numeric"
          maxLength="10"
          onChange={(event) =>
            updateNestedField(
              "emergencyContact",
              "phone",
              event.target.value.replace(/\D/g, ""),
            )
          }
          required
          value={profile.emergencyContact.phone}
        />
      </div>

      <h4 className="profile-section-title">Medical Information</h4>

      <div className="login-field">
        <label className="login-label" htmlFor="allergies">
          Allergies (optional)
        </label>
        <input
          className="login-input"
          id="allergies"
          onChange={(event) => updateField("allergies", event.target.value)}
          placeholder="Separate multiple allergies with commas"
          value={profile.allergies}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="chronic-diseases">
          Chronic Diseases (optional)
        </label>
        <input
          className="login-input"
          id="chronic-diseases"
          onChange={(event) =>
            updateField("chronicDiseases", event.target.value)
          }
          placeholder="Separate multiple conditions with commas"
          value={profile.chronicDiseases}
        />
      </div>

      <h4 className="profile-section-title">Insurance Information</h4>

      <div className="login-field">
        <label className="login-label" htmlFor="insurance-provider">
          Insurance Provider (optional)
        </label>
        <input
          className="login-input"
          id="insurance-provider"
          onChange={(event) =>
            updateNestedField("insurance", "provider", event.target.value)
          }
          value={profile.insurance.provider}
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="policy-number">
          Policy Number (optional)
        </label>
        <input
          className="login-input"
          id="policy-number"
          onChange={(event) =>
            updateNestedField("insurance", "policyNumber", event.target.value)
          }
          value={profile.insurance.policyNumber}
        />
      </div>

      

      {error && (
        <p className="login-card-subtitle" role="alert">
          {error}
        </p>
      )}

      <button className="login-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <span
            className="login-spinner"
            aria-label="Completing registration"
          />
        ) : (
          "Complete Registration"
        )}
      </button>
      <button
        className="login-submit"
        disabled={isSubmitting}
        type="button"
        onClick={onBack}
      >
        Back
      </button>
    </form>
  );
}

export default CompleteProfile;
