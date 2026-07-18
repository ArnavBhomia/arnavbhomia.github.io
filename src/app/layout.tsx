import "./globals.css";

export const metadata = {
  title: "Arnav Bhomia | APM Portfolio",
  description: "Associate Product Manager Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}