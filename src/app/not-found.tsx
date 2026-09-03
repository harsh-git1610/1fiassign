import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
        <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-200">404</h1>
        <h2 className="mt-2 text-xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-sm text-gray-500">
          The product or page you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
      >
        ← Back to Mobile Shop
      </Link>
    </div>
  );
}
