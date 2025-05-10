export default function CategoryLoading() {
  return (
    <div className="container py-8">
      <div className="h-8 bg-muted rounded animate-pulse w-1/4 mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[300px] rounded-md bg-muted animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
