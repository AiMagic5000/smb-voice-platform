import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="pt-20">
      {/* Hero Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F]">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-14 w-3/4 max-w-2xl mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-14 w-2/3 max-w-xl mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-1/2 max-w-lg mx-auto mb-8 bg-white/20" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-14 w-40 bg-white/20" />
            <Skeleton className="h-14 w-40 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-100">
                <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-12 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex gap-3">
                      <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-12 w-full mt-8" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
