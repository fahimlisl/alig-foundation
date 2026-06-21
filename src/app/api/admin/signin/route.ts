import adminModel from "@/src/models/admin.model";
import dbConnect from "@/src/lib/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, phoneNumber, password } = await request.json();

        if (!(email || phoneNumber)) {
            return Response.json(
                { success: false, message: "email or phone number required" },
                { status: 400 }
            );
        }

        if (!password) {
            return Response.json(
                { success: false, message: "password is required" },
                { status: 400 }
            );
        }

        const admin = await adminModel.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (!admin) {
            return Response.json(
                { success: false, message: "no admin found with the given email or phone number" },
                { status: 404 } 
            );
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return Response.json(
                { success: false, message: "incorrect password" },
                { status: 401 }
            );
        }

        const accessToken = jwt.sign(
            { _id: admin._id, email: admin.email, role: "admin" },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "45m" }
        );

        const refreshToken = jwt.sign(
            { _id: admin._id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "14d" }
        );

        admin.adminRefreshToken = refreshToken;
        await admin.save();

        const response = Response.json(
            {
                success: true,
                message: "admin logged in successfully",
                admin: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    phoneNumber: admin.phoneNumber,
                },
            },
            { status: 200 }
        );

        response.headers.append(
            "Set-Cookie",
            `adminAccessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${45 * 60}`
        );
        response.headers.append(
            "Set-Cookie",
            `adminRefreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${14 * 24 * 60 * 60}`
        );

        return response;
    } catch (error) {
        console.error("error while signing in the admin", error);
        return Response.json(
            { success: false, message: "failed while signing in the admin" },
            { status: 500 }
        );
    }
}