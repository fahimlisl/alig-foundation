import scholarshipModel from "@/src/models/scholarship.model";
import courseModel from "@/src/models/course.model";
import ScholarCounterModel from "@/src/models/counter.scholarship.model";

export interface CreateScholarshipInput {
  full_name: string;
  gurdianName: string;
  phone: string;
  email: string;
  address: string;
  course: string; // course TITLE
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



   
  const courseDoc = await courseModel.findById(input.course);
  if (!courseDoc) {
    throw new Error(`course not found`);
  }
  console.log("what's the input is throwing to us ?? ",input);
  console.log("what's the input.course is throwing to us ?? ",input.course);

  const c = await ScholarCounterModel.findOneAndUpdate(
    { course: courseDoc._id },
    {
      $inc: { lastNumber: 1 },
    },
    { upsert: true, new: true }
  );

  const roll_no = `ES${c.lastNumber.toString().padStart(4, "0")}${c.courseSymbol}`;

  // ---------- registration_no: year prefix + doc count ----------
  const yearPrefix = new Date().getFullYear().toString().slice(-2);
  const totalCount = await scholarshipModel.countDocuments();
  const registration_no = `${yearPrefix}${(totalCount + 1)
    .toString()
    .padStart(4, "0")}`;

  // ---------- test centre ----------
  const test_centre =
    input.mode === "online" ? "Online (Proctored Test)" : "Offline Centre (TBA)";

  // ---------- create row ----------
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