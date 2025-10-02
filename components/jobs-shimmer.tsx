import React from "react";

export default function JobsShimmer({ count = 6 }: { count?: number }) {
  // This component renders shimmer as table rows for jobs table (6 columns)
  return (
    <>
      <tbody className="ml-16 border-separate border-spacing-x-10">
        {Array.from({ length: count }).map((_, idx) => (
          <tr key={idx} className="animate-pulse max-w-full">
            {/* S No. */}
            <td className="py-1 md:py-2 px-1 md:px-2 text-center min-w-[48px]">
              <div className="h-4 w-full bg-gray-200 rounded" />
            </td>
            {/* ID */}
            <td className="py-1 md:py-2 px-1 md:px-2 text-center min-w-[128px]">
              <div className="h-4 w-full bg-gray-200 rounded" />
            </td>
            {/* Title */}
            <td className="py-1 md:py-2 px-1 md:px-2 text-center min-w-[180px]">
              <div className="h-4 w-full bg-gray-200 rounded" />
            </td>
            {/* Date */}
            <td className="py-1 md:py-2 px-1 md:px-2 text-center min-w-[180px]">
              <div className="h-4 w-full bg-gray-200 rounded" />
            </td>
            {/* Category */}
            <td className="py-1 md:py-2 px-1 md:px-2 text-center min-w-[180px]">
              <div className="h-4 w-full bg-gray-200 rounded" />
            </td>
            {/* Actions */}
            <td className="py-1 md:py-2 px-1 md:px-2 text-center min-w-[220px]">
              <div className="flex gap-2 justify-center">
                <div className="h-8 w-full bg-gray-200 rounded" />
                <div className="h-8 w-full bg-gray-200 rounded" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}

