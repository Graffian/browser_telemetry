import "./globals.css";

export const metadata = {
  title: "Browser Telemetry",
  description: "See what your browser reveals about your GPU, CPU, battery, and more."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
