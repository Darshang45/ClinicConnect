/**
 * Health Metric evaluation helpers — Phase 4.8
 * All clinical threshold logic is centralized here.
 * Import these in any component or future Doctor/Receptionist views.
 */

export const evalBloodPressure = (val) => {
  if (!val) return null;
  const parts = val.split("/").map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) return { label: "Recorded", cls: "hm-status--info" };
  const [sys, dia] = parts;
  if (sys < 120 && dia < 80)  return { label: "Normal",       cls: "hm-status--good" };
  if (sys <= 129 && dia < 80) return { label: "Elevated",     cls: "hm-status--warn" };
  if (sys <= 139 || dia <= 89) return { label: "High Stage 1", cls: "hm-status--warn" };
  return { label: "High Stage 2", cls: "hm-status--bad" };
};

export const evalHeartRate = (v) => {
  if (v === null || v === undefined) return null;
  if (v >= 60 && v <= 100) return { label: "Normal", cls: "hm-status--good" };
  if (v < 60)              return { label: "Low",    cls: "hm-status--warn" };
  return                          { label: "High",   cls: "hm-status--warn" };
};

export const evalBMI = (v) => {
  if (v === null || v === undefined) return null;
  if (v < 18.5) return { label: "Underweight", cls: "hm-status--warn" };
  if (v < 25)   return { label: "Healthy",     cls: "hm-status--good" };
  if (v < 30)   return { label: "Overweight",  cls: "hm-status--warn" };
  return               { label: "Obese",        cls: "hm-status--bad"  };
};

export const evalBloodSugar = (v) => {
  if (v === null || v === undefined) return null;
  if (v < 70)   return { label: "Low",          cls: "hm-status--bad"  };
  if (v <= 99)  return { label: "Normal",        cls: "hm-status--good" };
  if (v <= 125) return { label: "Pre-diabetic",  cls: "hm-status--warn" };
  return               { label: "High",          cls: "hm-status--bad"  };
};

export const evalOxygenLevel = (v) => {
  if (v === null || v === undefined) return null;
  if (v >= 95) return { label: "Normal",   cls: "hm-status--good" };
  if (v >= 90) return { label: "Low",      cls: "hm-status--warn" };
  return              { label: "Critical", cls: "hm-status--bad"  };
};

export const evalTemperature = (v) => {
  if (v === null || v === undefined) return null;
  if (v >= 97 && v <= 99) return { label: "Normal",          cls: "hm-status--good" };
  if (v > 99 && v <= 100.4)  return { label: "Low-grade fever", cls: "hm-status--warn" };
  if (v > 100.4)           return { label: "Fever",           cls: "hm-status--bad"  };
  return                          { label: "Low",             cls: "hm-status--warn" };
};
