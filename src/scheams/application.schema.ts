import { z } from "zod";

export const applicationValidation = z.object({
    name: z
            .string()
            .min(3,"name must be atleast 3 characters")
            .regex(/^[a-zA-Z0-9_]+$/,"name must not contain special chracter"),
    gurdianName: z
            .string()
            .min(3,"name must be atleast 3 characters")
            .regex(/^[a-zA-Z0-9_]+$/,"name must not contain special chracter"),
    phoneNumber: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Please enter a valid mobile number"),
    gurdianPhoneNumber: z
            .string()
            .trim()
            .regex(/^[6-9]\d{9}$/, "Please enter a valid mobile number"),
    gender: z.string(),
    schoolBoardName: z.string(),
    pin: z.number(),
    district: z.string(),
    state: z.string(),
    permanentAddress: z.string()
})