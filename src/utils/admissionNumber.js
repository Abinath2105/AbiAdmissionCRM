export const generateAdmissionNumber = (admission, data) => {
  const count = data.admissions.filter(
    a => a.programId === admission.programId
  ).length;

  return `INST/2026/UG/${admission.programId}/${admission.quota}/${String(count).padStart(4, "0")}`;
};