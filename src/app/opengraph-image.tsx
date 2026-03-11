import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 700 }}>
          Sergio Santos
        </h1>

        <p style={{ fontSize: 36, marginTop: 20 }}>
          Software Engineer
        </p>

        <p style={{ fontSize: 28, marginTop: 40 }}>
          portfoliosantossergio.vercel.app
        </p>
      </div>
    ),
    size
  )
}
