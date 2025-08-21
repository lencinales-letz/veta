"use client";

import Sidebar from "@/components/Sidebar";
import StatusDot from "@/components/StatusDot";
import { MOCK_CLIENTS, ClientIntegration } from "@/lib/mockData";
import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  BarChart3,
  TrendingUp,
  Package
} from "lucide-react";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "degraded" | "offline">("all");

  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.erpSystem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.billingSystem?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === "all") return matchesSearch;
      
      // Filter by integration status (if any system matches the filter)
      const hasStatus = client.erp === filterStatus || 
                       client.billing === filterStatus || 
                       client.other === filterStatus;
      
      return matchesSearch && hasStatus;
    });
  }, [searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const totalClients = MOCK_CLIENTS.length;
    const fullyOnline = MOCK_CLIENTS.filter(c => 
      c.erp === "online" && c.billing === "online" && c.other === "online"
    ).length;
    const hasIssues = MOCK_CLIENTS.filter(c => 
      c.erp === "offline" || c.billing === "offline" || c.other === "offline"
    ).length;
    const totalReconciled = MOCK_CLIENTS.reduce((sum, c) => sum + c.reconciledInvoices, 0);
    const totalPurchased = MOCK_CLIENTS.reduce((sum, c) => sum + c.monthlyPackage.purchased, 0);
    const totalProcessed = MOCK_CLIENTS.reduce((sum, c) => sum + c.monthlyPackage.processed, 0);

    return {
      totalClients,
      fullyOnline,
      hasIssues,
      totalReconciled,
      totalPurchased,
      totalProcessed,
      avgReconciledPerClient: Math.round(totalReconciled / totalClients),
      healthyPercentage: Math.round((fullyOnline / totalClients) * 100)
    };
  }, []);

  const getIntegrationIcon = (status: "online" | "degraded" | "offline") => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "offline":
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#f8fafe]">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
              <p className="text-gray-600 mt-1">Monitoreo de integraciones y estado de conciliación</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-all">
                <Settings className="w-4 h-4" />
                Configurar
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Total Clientes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>
            <div className="text-xs text-blue-600 mt-1">+2 este mes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Totalmente Online</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.fullyOnline}</div>
            <div className="text-xs text-green-600 mt-1">{stats.healthyPercentage}% del total</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Con Problemas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.hasIssues}</div>
            <div className="text-xs text-red-600 mt-1">Requieren atención</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Facturas Conciliadas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalReconciled.toLocaleString()}</div>
            <div className="text-xs text-purple-600 mt-1">Promedio: {stats.avgReconciledPerClient}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Facturas Compradas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPurchased.toLocaleString()}</div>
            <div className="text-xs text-orange-600 mt-1">Paquetes mensuales</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, ERP o sistema de facturación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "online" | "degraded" | "offline")}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="online">Solo Online</option>
                <option value="degraded">Con Degradación</option>
                <option value="offline">Con Problemas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Clientes</h3>
                  <p className="text-sm text-gray-500">{filteredClients.length} clientes encontrados</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sistema ERP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sistema Facturación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Otros Sistemas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facturas Conciliadas
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paquete Mensual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">ID: {client.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getIntegrationIcon(client.erp)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.erpSystem || 'No especificado'}
                          </div>
                          <div className={`text-xs capitalize ${
                            client.erp === 'online' ? 'text-green-600' :
                            client.erp === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {client.erp === 'online' ? 'En línea' : 
                             client.erp === 'degraded' ? 'Degradado' : 'Fuera de línea'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getIntegrationIcon(client.billing)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.billingSystem || 'No especificado'}
                          </div>
                          <div className={`text-xs capitalize ${
                            client.billing === 'online' ? 'text-green-600' :
                            client.billing === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {client.billing === 'online' ? 'En línea' : 
                             client.billing === 'degraded' ? 'Degradado' : 'Fuera de línea'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getIntegrationIcon(client.other)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.otherSystems?.join(', ') || 'Ninguno'}
                          </div>
                          <div className={`text-xs capitalize ${
                            client.other === 'online' ? 'text-green-600' :
                            client.other === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {client.other === 'online' ? 'En línea' : 
                             client.other === 'degraded' ? 'Degradado' : 'Fuera de línea'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {client.reconciledInvoices.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">facturas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Compradas:</span>
                          <span className="text-sm font-medium text-blue-600">
                            {client.monthlyPackage.purchased.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Recibidas:</span>
                          <span className="text-sm font-medium text-indigo-600">
                            {client.monthlyPackage.received.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Causadas:</span>
                          <span className="text-sm font-medium text-green-600">
                            {client.monthlyPackage.processed.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-1 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-700">Disponibles:</span>
                          <span className={`text-sm font-bold ${
                            client.monthlyPackage.remaining > 100 ? 'text-green-600' :
                            client.monthlyPackage.remaining > 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {client.monthlyPackage.remaining.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((client.monthlyPackage.processed / client.monthlyPackage.purchased) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-center text-gray-500">
                          {Math.round((client.monthlyPackage.processed / client.monthlyPackage.purchased) * 100)}% utilizado
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
