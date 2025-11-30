import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If creator submits form
    if (body.type === "creator_submit") {
      const data = await resend.emails.send({
        from: "VoxCry <onboarding@resend.dev>",
        to: "bingpenticton2013@gmail.com",
        subject: `New Creator Submission – ${body.handle}`,
        html: `
          <h2>🚀 New Creator Submission</h2>
          <p><strong>TikTok Handle:</strong> ${body.handle}</p>
          <p><strong>Category:</strong> ${body.category}</p>
          <p><strong>Niche:</strong> ${body.niche}</p>
          <p><strong>Region:</strong> ${body.region}</p>
          <p><strong>Email:</strong> ${body.email || "N/A"}</p>
          <p><em>Submitted at ${new Date().toLocaleString()}</em></p>
        `,
      });

      console.log("Creator submit email sent:", data);
      return NextResponse.json({ success: true });
    }

    // Otherwise, normal contact form
    const { name, email, message } = body;

    const data = await resend.emails.send({
      from: "VoxCry <onboarding@resend.dev>",
      to: "bingpenticton2013@gmail.com", // your email
      subject: `New message from ${name}`,
      html: `
        <h2>New VoxCry Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("Contact form email sent:", data);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
