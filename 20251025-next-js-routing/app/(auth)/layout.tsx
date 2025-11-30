import Link from 'next/link'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header>
        <nav className="text-2xl font-bold flex gap-4">
          <Link href="/">Home</Link>
          <span>About</span>
          <span>Contact</span>
        </nav>
      </header>
      {children}
    </>
  )
}
