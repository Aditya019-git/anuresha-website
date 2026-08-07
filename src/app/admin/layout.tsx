import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin">
              <Image src="/images/logo.png" alt="Anuresha Logo" width={180} height={70} className="object-contain" />
            </Link>
            <div className="h-10 w-px bg-stone-200 mx-2 hidden sm:block"></div>
            <h1 className="font-outfit text-2xl font-bold text-stone-900 hidden sm:block">
              Admin <span className="text-amber-600">Portal</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-stone-100 px-5 py-2.5 rounded-full border border-stone-200 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-bold text-stone-600 hidden sm:block">System Online</span>
            </div>
            <form action={handleLogout}>
              <button type="submit" className="text-sm font-medium text-stone-500 hover:text-red-600 transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>
        {/* Admin Tabs */}
        <div className="bg-stone-100/50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-8 flex gap-8">
            <Link href="/admin" className="py-4 text-sm font-medium text-stone-600 hover:text-amber-600 border-b-2 border-transparent hover:border-amber-600 transition-colors">
              Incoming Leads
            </Link>
            <Link href="/admin/portfolio" className="py-4 text-sm font-medium text-stone-600 hover:text-amber-600 border-b-2 border-transparent hover:border-amber-600 transition-colors">
              Manage Portfolio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
