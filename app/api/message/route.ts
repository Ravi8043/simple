import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    )

    if (!res.ok) {
      const error = await res.text()
      console.error("Gemini error:", error)
      return NextResponse.json(
        { reply: "Model error." },
        { status: 500 }
      )
    }

    const data = await res.json()

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model."

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    )
  }
}
