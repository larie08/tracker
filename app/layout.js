import './globals.css'

export const metadata = {
  title: 'Internship Hours Tracker',
  description: 'Track your UI/UX internship hours towards 540 hours goal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}