import './globals.css'

export const metadata = {
  title: 'CYBERNEX — Cybersecurity Simulator',
  description: 'A cinematic cybersecurity learning and simulation interface.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
