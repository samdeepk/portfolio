import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function NavigateLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">Loading navigation tools...</p>
      </div>
    </div>
  )
}
