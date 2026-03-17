import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    name: "Sergio Santos",
    role: "Data Science and AI Specialist",
    keywords: [
      "Data Scientist Resume",
      "AI Engineer CV",
      "Machine Learning Engineer Resume"
    ]
  })
}
