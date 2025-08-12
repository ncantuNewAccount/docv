export default function SearchLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="h-9 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="bg-white border rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Search Stats Skeleton */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Search Results Skeleton */}
      <div className="bg-white border rounded-lg">
        <div className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="flex space-x-1">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
