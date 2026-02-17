import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { reply: "Message is required." },
        { status: 400 }
      )
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            role: "system",
            parts: [
              {
                text: "Whenever the user message include 'Hi' or 'Hello', include the reply with 'At your service Tejas Lord!!!' but exclude the response if the response conveys the same message as system instruction.",
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)

      return NextResponse.json(
        { reply: "Model error." },
        { status: 500 }
      )
    }

    const data = await response.json()

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response from model."

    return NextResponse.json({ reply })

  } catch (error) {
    console.error("Server error:", error)

    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    )
  }
}
