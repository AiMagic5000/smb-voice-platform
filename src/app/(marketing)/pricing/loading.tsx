import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F]">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-56 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-14 w-2/3 max-w-xl mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-1/2 max-w-lg mx-auto bg-white/20" />
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl bg-white shadow-xl border-2 ${
                  i === 1 ? "border-[#C9A227] scale-105" : "border-gray-100"
                }`}
              >
                <div className="text-center mb-6">
                  <Skeleton className="h-6 w-28 mx-auto mb-4" />
                  <Skeleton className="h-14 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
                <div className="space-y-3 mb-8">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="flex gap-3">
                      <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
                      <Skeleton className="h-5 flex-1" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-56 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
