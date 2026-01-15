import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F]">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-40 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-14 w-2/3 max-w-xl mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto bg-white/20" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-10 w-24 mx-auto mb-2" />
                  <Skeleton className="h-5 w-32 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton className="h-10 w-48 mb-6" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-3/4 mb-6" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-5/6 mb-6" />
              <Skeleton className="h-6 w-full mb-3" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] rounded-2xl p-8">
              <Skeleton className="w-12 h-12 mb-6 bg-white/20" />
              <Skeleton className="h-8 w-40 mb-4 bg-white/20" />
              <Skeleton className="h-5 w-full mb-2 bg-white/20" />
              <Skeleton className="h-5 w-3/4 mb-6 bg-white/20" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 bg-white/20" />
                    <Skeleton className="h-5 w-48 bg-white/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-40 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                <Skeleton className="w-14 h-14 rounded-2xl mb-4" />
                <Skeleton className="h-6 w-28 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
