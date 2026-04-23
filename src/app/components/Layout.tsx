import { Outlet, Link, useLocation } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell } from "lucide-react";

export function Layout() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/wallet-activity", label: "Wallet Activity" },
    { path: "/token-flow", label: "Token Flow" },
    { path: "/network-health", label: "Network Health" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Nav Links */}
            <div className="flex items-center gap-8">
              <div className="text-xl font-semibold text-slate-900">
                Web3 Analytics
              </div>
              
              <div className="flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive(item.path)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="flex items-center gap-4">
              <Link 
                to="/notifications"
                className="p-2 rounded-full hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              
              <Link to="/profile">
                <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-slate-200 hover:ring-indigo-300 transition-all">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                  <AvatarFallback>PM</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
