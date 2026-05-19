import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";      // your existing connection util
import AdminUser from "@/models/AdminUser";

export async function POST(req) {
  try {
    const { fullName, email, password, aadhar } = await req.json();
    if (!fullName || !email || !password || !aadhar) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    await connectDB();

    // check duplicates
    const exists = await AdminUser.findOne({ email });
    if (exists) {
      return new Response(JSON.stringify({ message: "Email already registered" }), { status: 400 });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    await AdminUser.create({ fullName, email, aadhar, password: hashed });

    return new Response(JSON.stringify({ message: "Registration successful" }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
