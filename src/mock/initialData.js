// export const initialData = {
//   programs: [],
//   applicants: [],
//   admissions: []
// };



export const initialData = {
  programs: [
    {
      id: "CSE-001",
      name: "Computer Science Engineering",
      institution: "ABC College",
      campus: "Main Campus",
      department: "Engineering",
      courseType: "UG",
      entryType: "Regular",
      admissionMode: "Government",
      intake: 100,
      quotas: [
        { type: "KCET", seats: 50 },
        { type: "COMEDK", seats: 30 },
        { type: "Management", seats: 20 }
      ]
    },
    {
      id: "MBA-001",
      name: "MBA",
      institution: "ABC College",
      campus: "City Campus",
      department: "Management",
      courseType: "PG",
      entryType: "Regular",
      admissionMode: "Management",
      intake: 60,
      quotas: [
        { type: "KCET", seats: 20 },
        { type: "COMEDK", seats: 20 },
        { type: "Management", seats: 20 }
      ]
    }
  ],

  applicants: [
    {
      id: 1,
      name: "Ravi Kumar",
      category: "GM",
      entryType: "Regular",
      quotaType: "KCET",
      marks: 85,
      documents: "VERIFIED",
      status: "VERIFIED"
    },
    {
      id: 2,
      name: "Sneha Reddy",
      category: "SC",
      entryType: "Regular",
      quotaType: "COMEDK",
      marks: 78,
      documents: "SUBMITTED",
      status: "ALLOCATED"
    },
    {
      id: 3,
      name: "Arjun Sharma",
      category: "GM",
      entryType: "Lateral",
      quotaType: "Management",
      marks: 88,
      documents: "PENDING",
      status: "CREATED"
    }
  ],

  admissions: [
    {
      id: 101,
      applicantId: 1,
      programId: "CSE-001",
      quota: "KCET",
      status: "CONFIRMED",
      feeStatus: "PAID",
      admissionNumber: "INST/2026/UG/CSE/KCET/0001"
    },
    {
      id: 102,
      applicantId: 2,
      programId: "CSE-001",
      quota: "COMEDK",
      status: "ALLOCATED",
      feeStatus: "PENDING"
    },
    {
      id: 103,
      applicantId: 3,
      programId: "MBA-001",
      quota: "Management",
      status: "ALLOCATED",
      feeStatus: "PENDING"
    }
  ]
};