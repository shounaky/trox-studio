import "./globals.css";
import "../styles/studio.css";

export const metadata = {
  title: "Trox Studio",
  description: "AI social media manager for Trox Creations — premium handcrafted journals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
