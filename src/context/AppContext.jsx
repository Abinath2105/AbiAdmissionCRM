import React, { createContext, useContext, useState, useEffect } from "react";
import { loadData, saveData } from "../services/storage";
import { initialData } from "../mock/initialData";
import { generateAdmissionNumber } from "../utils/admissionNumber";
const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(loadData() || initialData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  // 🔹 Add Program with Quota Validation
  const addProgram = (program) => {
    const totalQuota = program.quotas.reduce((a, b) => a + b.seats, 0);

    if (totalQuota !== program.intake) {
      alert("Quota total must match intake");
      return;
    }

    setData(prev => ({
      ...prev,
      programs: [...prev.programs, program]
    }));
  };

  // 🔹 Add Applicant
  const addApplicant = (applicant) => {
    setData(prev => ({
      ...prev,
      applicants: [...prev.applicants, applicant]
    }));
  };

  // 🔹 Allocate Seat
//   const allocateSeat = (applicantId, programId, quotaType) => {
//     const program = data.programs.find(p => p.id === programId);

//     const filled = data.admissions.filter(
//       a => a.programId === programId && a.quota === quotaType
//     ).length;

//     const quota = program.quotas.find(q => q.type === quotaType);

//     if (filled >= quota.seats) {
//       alert("Quota Full!");
//       return;
//     }

//     const admission = {
//       id: Date.now(),
//       applicantId,
//       programId,
//       quota: quotaType,
//       status: "ALLOCATED",
//       feeStatus: "PENDING"
//     };

//     setData(prev => ({
//       ...prev,
//       admissions: [...prev.admissions, admission]
//     }));
//   };
// 🔹 Allocate Seat (FIXED)
const allocateSeat = (payload) => {
  setData(prev => {

    const program = prev.programs.find(
      p => p.id === payload.programId
    );

    // ✅ SAFETY CHECK
    if (!program || !program.quotas) {
      alert("Invalid Program!");
      return prev;
    }

    const quota = program.quotas.find(
      q => q.type === payload.quota
    );

    if (!quota) {
      alert("Invalid Quota!");
      return prev;
    }

    const filled = prev.admissions.filter(
      a =>
        a.programId === payload.programId &&
        a.quota === payload.quota
    ).length;

    // ❌ Block if full
    if (filled >= quota.seats) {
      alert("❌ Quota Full!");
      return prev;
    }

    // ✅ Create admission
    const admission = {
      id: Date.now(),
      ...payload,
      status: "ALLOCATED",
      feeStatus: "PENDING"
    };

    return {
      ...prev,
      admissions: [...prev.admissions, admission]
    };
  });
};



const updateFeeStatus = (admissionId, status) => {
  setData(prev => ({
    ...prev,
    admissions: prev.admissions.map(a =>
      a.id === admissionId ? { ...a, feeStatus: status } : a
    )
  }));
};
  // 🔹 Confirm Admission
  const confirmAdmission = (admissionId) => {
    setData(prev => {
      const updated = prev.admissions.map(a => {
        if (a.id === admissionId && a.feeStatus === "PAID") {
          return {
            ...a,
            status: "CONFIRMED",
            admissionNumber: generateAdmissionNumber(a, prev)
          };
        }
        return a;
      });

      return { ...prev, admissions: updated };
    });
  };

  return (
    <AppContext.Provider value={{
      data,
      addProgram,
      addApplicant,
      allocateSeat,
      confirmAdmission,
      updateFeeStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};