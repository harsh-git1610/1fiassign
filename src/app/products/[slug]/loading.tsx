export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT: Image Skeleton */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="relative aspect-square w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="mt-4 flex gap-2">
              <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>

        {/* RIGHT: Details Skeleton */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-16 w-full animate-pulse rounded bg-gray-100" />
            
            <hr className="my-6 border-gray-100" />
            
            <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
            
            <div className="mt-8">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-100 mb-3" />
              <div className="flex gap-2">
                <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>

            <div className="mt-6">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-100 mb-3" />
              <div className="flex gap-2">
                <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
                <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>
          </div>

          {/* EMI Plans Skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200 mb-4" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-gray-50 border border-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
