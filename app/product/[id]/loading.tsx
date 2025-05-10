export default function ProductLoading() {
  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted rounded-lg h-[600px] animate-pulse"></div>
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-6 bg-muted rounded animate-pulse w-1/4"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/2 mt-4"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-2/3 mt-4"></div>
          <div className="h-20 bg-muted rounded animate-pulse w-full mt-4"></div>
          <div className="flex gap-4 mt-8">
            <div className="h-10 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-10 bg-muted rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
