import { Suspense } from "react";
import TableList from "../components/TableList";
import PageNav from "../components/PageNav";

function TableListSkeleton() {
  return (
    <div className="min-h-screen px-2 py-4 sm:px-8 sm:py-6" style={{ backgroundColor: '#283141' }}>
      <div className="fixed inset-0 -z-10" style={{ backgroundColor: '#283141' }} />
      <div className="relative z-10">
        <div className="mb-8 max-w-4xl mx-auto" />
        <div className="space-y-[-8px] max-w-7xl mx-auto">
          {[...Array(3)].map((_, sectionIdx) => (
            <div key={sectionIdx} className="relative -mt-16 first:mt-0">
              <div className="h-8 w-32 bg-gray-700/50 rounded mb-3 sm:mb-6 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                {[...Array(sectionIdx === 0 ? 4 : 2)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border-2 border-gray-700/30 p-2 animate-pulse"
                    style={{ backgroundColor: '#222937' }}
                  >
                    <div className="p-0.5 sm:p-1">
                      <div className="h-5 w-24 bg-gray-700/50 rounded mb-2" />
                      <div className="h-3 w-16 bg-gray-700/30 rounded mb-3" />
                    </div>
                    <div className="h-7 w-20 bg-gray-700/30 rounded-full mb-2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <PageNav
        titleHref="/dashboard"
        buttons={[{ label: "Dashboard", href: "/dashReport" }]}
        showLogout
      />
      <Suspense fallback={<TableListSkeleton />}>
        <TableList />
      </Suspense>
    </div>
  );
}
