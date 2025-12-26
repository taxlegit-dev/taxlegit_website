import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY!;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID!;
    const SERVER = process.env.MAILCHIMP_SERVER!;

    const url = `https://${SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

    const data = {
      email_address: email,
      status: "pending", // double opt-in
      tags: ["taxlegit-subscribers"],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString(
          "base64"
        )}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    /**
     * CASE 1: Already exists (subscribed OR pending)
     */
    if (result?.title === "Member Exists") {
      return NextResponse.json({
        success: true,
        message: "This email is already subscribed or pending confirmation.",
      });
    }

    /**
     * CASE 2: Mailchimp rejected request
     */
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result?.detail || "Mailchimp rejected the request",
        },
        { status: response.status }
      );
    }

    /**
     * CASE 3: Success (new pending subscriber)
     */
    return NextResponse.json({
      success: true,
      message: "Please check your email to confirm subscription.",
    });
  } catch (error) {
    /**
     * CASE 4: Server / unexpected error
     */
    console.error("Mailchimp error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
