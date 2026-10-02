import scholarshipModel from "@/src/models/scholarship.model";

export interface CreateScholarshipInput {
  full_name: string;
  gurdianName: string;
  phone: string;
  email: string;
  address: string;
  course: string;
  gender: string;
  mode: "online" | "offline";
  avatarUrl?: string;
  razorpayOrderId?: string;
}

export async function createScholarshipFromOrder(input: CreateScholarshipInput) {
  if (input.razorpayOrderId) {
    const existing = await scholarshipModel.findOne({
      razorpayOrderId: input.razorpayOrderId,
    });
    if (existing) return { scholarship: existing, alreadyExisted: true };
  }

  const duplicate = await scholarshipModel.findOne({
    phone: input.phone,
    course: input.course,
  });
  if (duplicate) return { scholarship: duplicate, alreadyExisted: true };

  const totalCount = await scholarshipModel.countDocuments();
  const nextNumber = totalCount + 1;

  const registration_no = `AF${(nextNumber + 100)
    .toString()
    .padStart(4, "0")}`;

  const yearPrefix = (new Date().getFullYear() + 1).toString().slice(-2);
  const roll_no = `${yearPrefix}${nextNumber.toString().padStart(4, "0")}`;

  const test_centre =
    input.mode === "online" ? "Online (Proctored Test)" : "Offline Centre (TBA)";

  const scholarship = await scholarshipModel.create({
    avatar:
      input.avatarUrl ?? "https://via.placeholder.com/150?text=Pending",
    full_name: input.full_name,
    gurdianName: input.gurdianName,
    phone: input.phone,
    email: input.email,
    address: input.address,
    test_centre,
    roll_no,
    registration_no,
    course: input.course, 
    mode: input.mode,
    gender: input.gender,
    ...(input.razorpayOrderId ? { razorpayOrderId: input.razorpayOrderId } : {}),
  });

  return { scholarship, alreadyExisted: false };
}