import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Authentication Error
        </h1>
        <p className="mb-6 text-slate-600">
          Sorry, there was an error during authentication. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-emerald-700 px-6 py-2 text-white transition hover:bg-emerald-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
