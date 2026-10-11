
export interface AdmitCardData {
  candidateName: string;
  guardianName: string;
  registrationNo: string;
  rollNo: string;
  avatarUrl: string;
  course: string;
  mode: "online" | "offline";
  testCentre: string;
  title: string;
  examDate: string;
  examTime: string;
  foundationEmail: string;
  contactNumbers: string;
  instructions: string[];
}

export function isAdmitCardData(
  value: unknown
): value is AdmitCardData {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;

  const requiredFields = [
    "candidateName",
    "guardianName",
    "registrationNo",
    "rollNo",
    "avatarUrl",
    "course",
    "testCentre",
    "title",
    "examDate",
    "examTime",
    "foundationEmail",
    "contactNumbers",
  ];

  return (
    requiredFields.every(
      (field) => typeof data[field] === "string"
    ) &&
    (data.mode === "online" || data.mode === "offline") &&
    Array.isArray(data.instructions) &&
    data.instructions.every(
      (instruction) => typeof instruction === "string"
    )
  );
}
