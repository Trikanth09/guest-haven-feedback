
import { Skeleton } from "@/components/ui/skeleton";

const HotelDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-80 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div>
          <Skeleton className="h-60 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
};

export default HotelDetailSkeleton;
