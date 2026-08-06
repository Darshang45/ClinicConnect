/**
 * Pure Node.js PDF Generator for ClinicConnect Prescriptions
 * Generates a valid PDF document Buffer without external binary dependencies.
 */

function escapePdfText(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export function generatePrescriptionPDF(data) {
  const patient = data.patient || {};
  const patientUser = patient.user || {};
  const doctor = data.doctor || {};
  const doctorUser = doctor.user || {};

  const patientName = patient.fullName || patientUser.fullName || "Patient";
  const patientId = patient.patientId || "N/A";
  const gender = patient.gender || "N/A";
  const bloodGroup = patient.bloodGroup || "N/A";
  
  // Calculate age if DOB exists
  let ageStr = "N/A";
  if (patient.dateOfBirth) {
    const dob = new Date(patient.dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
      }
      ageStr = `${age} yrs`;
    }
  } else if (patient.age !== undefined && patient.age !== null) {
    ageStr = `${patient.age} yrs`;
  }

  const doctorName = doctorUser.fullName ? `Dr. ${doctorUser.fullName}` : (doctor.name || "Doctor");
  const specialization = doctor.specialization || "General Physician";

  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US");

  const diagnosis = data.diagnosis || "General Consultation";
  const notes = data.notes || "";
  const followUpDate = data.followUpDate
    ? new Date(data.followUpDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const medicines = Array.isArray(data.medicines) ? data.medicines : [];

  // PDF Stream Commands
  const streamLines = [];

  // Top Accent Header Bar (Primary Cyan/Navy)
  streamLines.push("0.08 0.35 0.62 rg"); // Fill color #14599E
  streamLines.push("0 742 612 50 re f"); // Draw header bar box

  // Header Title
  streamLines.push("BT");
  streamLines.push("/F1 22 Tf");
  streamLines.push("1 1 1 rg"); // White text
  streamLines.push("40 758 Td");
  streamLines.push(`(${escapePdfText("CLINIC CONNECT")}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 10 Tf");
  streamLines.push("1 1 1 rg");
  streamLines.push("440 758 Td");
  streamLines.push(`(${escapePdfText("MEDICAL PRESCRIPTION")}) Tj`);
  streamLines.push("ET");

  // Doctor & Facility Info Box
  streamLines.push("0.96 0.97 0.98 rg");
  streamLines.push("40 655 250 70 re f");

  streamLines.push("BT");
  streamLines.push("/F1 12 Tf");
  streamLines.push("0.1 0.15 0.2 rg");
  streamLines.push("50 705 Td");
  streamLines.push(`(${escapePdfText(doctorName)}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 10 Tf");
  streamLines.push("0.4 0.45 0.5 rg");
  streamLines.push("50 690 Td");
  streamLines.push(`(${escapePdfText(specialization)}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 9 Tf");
  streamLines.push("0.3 0.3 0.3 rg");
  streamLines.push("50 670 Td");
  streamLines.push(`(${escapePdfText("ClinicConnect Medical Center")}) Tj`);
  streamLines.push("ET");

  // Patient Info Box
  streamLines.push("0.96 0.97 0.98 rg");
  streamLines.push("310 655 262 70 re f");

  streamLines.push("BT");
  streamLines.push("/F1 11 Tf");
  streamLines.push("0.1 0.15 0.2 rg");
  streamLines.push("320 705 Td");
  streamLines.push(`(${escapePdfText(`Patient: ${patientName}`)}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 9 Tf");
  streamLines.push("0.3 0.3 0.3 rg");
  streamLines.push("320 688 Td");
  streamLines.push(`(${escapePdfText(`ID: ${patientId}  |  Gender: ${gender}  |  Age: ${ageStr}`)}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 9 Tf");
  streamLines.push("0.3 0.3 0.3 rg");
  streamLines.push("320 672 Td");
  streamLines.push(`(${escapePdfText(`Blood Group: ${bloodGroup}  |  Date: ${dateStr}`)}) Tj`);
  streamLines.push("ET");

  // Divider Line
  streamLines.push("0.85 0.88 0.91 RG");
  streamLines.push("2 w");
  streamLines.push("40 640 m 572 640 l S");

  // Diagnosis Section
  streamLines.push("BT");
  streamLines.push("/F1 11 Tf");
  streamLines.push("0.08 0.35 0.62 rg");
  streamLines.push("40 618 Td");
  streamLines.push(`(${escapePdfText("DIAGNOSIS")}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 10 Tf");
  streamLines.push("0.2 0.2 0.2 rg");
  streamLines.push("40 600 Td");
  streamLines.push(`(${escapePdfText(diagnosis)}) Tj`);
  streamLines.push("ET");

  // Medicines Table Header Box
  streamLines.push("0.08 0.35 0.62 rg");
  streamLines.push("40 550 532 24 re f");

  streamLines.push("BT");
  streamLines.push("/F1 9 Tf");
  streamLines.push("1 1 1 rg");
  streamLines.push("50 558 Td");
  streamLines.push(`(${escapePdfText("MEDICINE NAME")}) Tj`);
  streamLines.push("180 558 Td");
  streamLines.push(`(${escapePdfText("DOSAGE")}) Tj`);
  streamLines.push("80 558 Td");
  streamLines.push(`(${escapePdfText("FREQUENCY")}) Tj`);
  streamLines.push("80 558 Td");
  streamLines.push(`(${escapePdfText("DURATION")}) Tj`);
  streamLines.push("70 558 Td");
  streamLines.push(`(${escapePdfText("QTY")}) Tj`);
  streamLines.push("ET");

  // Render Medicine Rows
  let currentY = 525;
  if (medicines.length === 0) {
    streamLines.push("BT");
    streamLines.push("/F2 9 Tf");
    streamLines.push("0.5 0.5 0.5 rg");
    streamLines.push("50 525 Td");
    streamLines.push(`(${escapePdfText("No medicines listed.")}) Tj`);
    streamLines.push("ET");
    currentY = 500;
  } else {
    medicines.forEach((med, idx) => {
      // Alternate row background
      if (idx % 2 === 0) {
        streamLines.push("0.97 0.98 0.99 rg");
        streamLines.push(`40 ${currentY - 6} 532 26 re f`);
      }

      const medName = med.medicineName || (typeof med.medicine === "object" ? med.medicine?.name : med.medicine) || "Medicine";
      const dosage = med.dosage || "-";
      const freq = med.frequency || "-";
      const dur = med.duration || "-";
      const qty = med.quantity ? String(med.quantity) : "-";
      const inst = med.instructions ? `Note: ${med.instructions}` : "";

      streamLines.push("BT");
      streamLines.push("/F1 9 Tf");
      streamLines.push("0.1 0.1 0.1 rg");
      streamLines.push(`50 ${currentY + 4} Td`);
      streamLines.push(`(${escapePdfText(medName)}) Tj`);
      streamLines.push("ET");

      streamLines.push("BT");
      streamLines.push("/F2 9 Tf");
      streamLines.push("0.25 0.25 0.25 rg");
      streamLines.push(`230 ${currentY + 4} Td`);
      streamLines.push(`(${escapePdfText(dosage)}) Tj`);
      streamLines.push(`80 ${currentY + 4} Td`);
      streamLines.push(`(${escapePdfText(freq)}) Tj`);
      streamLines.push(`80 ${currentY + 4} Td`);
      streamLines.push(`(${escapePdfText(dur)}) Tj`);
      streamLines.push(`70 ${currentY + 4} Td`);
      streamLines.push(`(${escapePdfText(qty)}) Tj`);
      streamLines.push("ET");

      if (inst) {
        currentY -= 14;
        streamLines.push("BT");
        streamLines.push("/F2 8 Tf");
        streamLines.push("0.4 0.4 0.4 rg");
        streamLines.push(`60 ${currentY + 4} Td`);
        streamLines.push(`(${escapePdfText(inst)}) Tj`);
        streamLines.push("ET");
      }

      currentY -= 26;
    });
  }

  // Clinical Notes & Follow Up
  currentY -= 10;
  streamLines.push("0.85 0.88 0.91 RG");
  streamLines.push("1 w");
  streamLines.push(`40 ${currentY} m 572 ${currentY} l S`);

  currentY -= 20;
  if (notes) {
    streamLines.push("BT");
    streamLines.push("/F1 10 Tf");
    streamLines.push("0.08 0.35 0.62 rg");
    streamLines.push(`40 ${currentY} Td`);
    streamLines.push(`(${escapePdfText("CLINICAL NOTES")}) Tj`);
    streamLines.push("ET");

    currentY -= 16;
    streamLines.push("BT");
    streamLines.push("/F2 9 Tf");
    streamLines.push("0.25 0.25 0.25 rg");
    streamLines.push(`40 ${currentY} Td`);
    streamLines.push(`(${escapePdfText(notes)}) Tj`);
    streamLines.push("ET");
    currentY -= 20;
  }

  if (followUpDate) {
    streamLines.push("BT");
    streamLines.push("/F1 10 Tf");
    streamLines.push("0.08 0.35 0.62 rg");
    streamLines.push(`40 ${currentY} Td`);
    streamLines.push(`(${escapePdfText(`RECOMMENDED FOLLOW-UP DATE: ${followUpDate}`)}) Tj`);
    streamLines.push("ET");
    currentY -= 25;
  }

  // Doctor Signature Placeholder Box
  const sigY = Math.max(currentY - 60, 100);

  streamLines.push("0.7 0.7 0.7 RG");
  streamLines.push("1 w");
  streamLines.push(`400 ${sigY + 35} m 550 ${sigY + 35} l S`);

  streamLines.push("BT");
  streamLines.push("/F1 10 Tf");
  streamLines.push("0.2 0.2 0.2 rg");
  streamLines.push(`400 ${sigY + 20} Td`);
  streamLines.push(`(${escapePdfText(doctorName)}) Tj`);
  streamLines.push("ET");

  streamLines.push("BT");
  streamLines.push("/F2 8 Tf");
  streamLines.push("0.5 0.5 0.5 rg");
  streamLines.push(`400 ${sigY + 8} Td`);
  streamLines.push(`(${escapePdfText("Authorized Medical Practitioner")}) Tj`);
  streamLines.push("ET");

  // Bottom Footer Bar
  streamLines.push("0.94 0.95 0.96 rg");
  streamLines.push("0 0 612 35 re f");

  streamLines.push("BT");
  streamLines.push("/F2 8 Tf");
  streamLines.push("0.5 0.5 0.5 rg");
  streamLines.push("40 14 Td");
  streamLines.push(`(${escapePdfText("ClinicConnect Healthcare System  |  This is a computer-generated medical prescription.")}) Tj`);
  streamLines.push("ET");

  const contentStream = streamLines.join("\n");
  const contentLength = Buffer.byteLength(contentStream, "utf-8");

  // Construct PDF Objects
  const objects = [];
  
  // Obj 1: Catalog
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  
  // Obj 2: Pages
  objects.push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  
  // Obj 3: Page
  objects.push(
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj"
  );
  
  // Obj 4: Helvetica-Bold
  objects.push("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");
  
  // Obj 5: Helvetica
  objects.push("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");
  
  // Obj 6: Contents Stream
  objects.push(`6 0 obj\n<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream\nendobj`);

  // Build PDF file content and xref table
  let pdfHeader = "%PDF-1.4\n";
  let body = "";
  const offsets = [0]; // Offset 0 is object 0 free entry

  let currentOffset = Buffer.byteLength(pdfHeader, "utf-8");

  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset);
    const objStr = objects[i] + "\n";
    body += objStr;
    currentOffset += Buffer.byteLength(objStr, "utf-8");
  }

  const xrefOffset = currentOffset;

  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const offsetStr = String(offsets[i]).padStart(10, "0");
    xref += `${offsetStr} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdfHeader + body + xref + trailer, "utf-8");
}
