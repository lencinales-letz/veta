"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, Settings, MoreVertical, ShoppingCart, Package2 } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/facturas", label: "Facturas", icon: FileText },
  { href: "/ordenes-compra", label: "Órdenes de Compra", icon: ShoppingCart },
  { href: "/entradas", label: "Entradas", icon: Package2 },
  { href: "/dashboard#settings", label: "Ajustes", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    // Handle exact matches for main routes
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    if (href === "/facturas" && pathname === "/facturas") return true;
    if (href === "/clientes" && pathname === "/clientes") return true;
    if (href === "/ordenes-compra" && pathname === "/ordenes-compra") return true;
    if (href === "/entradas" && pathname === "/entradas") return true;
    
    // Handle hash links for dashboard sections
    if (href.includes("#") && pathname === "/dashboard") {
      return false; // For now, only show dashboard as active when on dashboard
    }
    
    return false;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#fafbff] border-r border-gray-100 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">VETA</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">Conciliación con IA</p>
      </div>
      
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link 
                key={href} 
                href={href} 
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600">
              <div className="size-5 bg-gray-200 rounded"></div>
              <span>Statistics</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600">
              <div className="size-5 bg-gray-200 rounded"></div>
              <span>Archivos</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-600">
              <div className="size-5 bg-gray-200 rounded"></div>
              <span>Reportes</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="p-4">
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">Bharath</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}


