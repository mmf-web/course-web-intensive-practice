import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="">
        Hi! Go to
        <Link className="text-blue-500" href="/users">
          Users
        </Link>
      </main>
    </div>
  )
}
