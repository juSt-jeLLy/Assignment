import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

/** Standard authenticated dashboard shell. */
export function AppShell() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
