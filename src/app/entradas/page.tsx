"use client";

import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import { MOCK_GOODS_ENTRIES, MOCK_CLIENTS, GoodsEntry } from "@/lib/mockData";
import { useState, useMemo } from "react";
import { 
  Package2, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Link
} from "lucide-react";

export default function EntradasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<GoodsEntry | null>(null);

  const filteredEntries = useMemo(() => {
    return MOCK_GOODS_ENTRIES.filter(entry => {
      const matchesSearch = entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClient = filterClient === "all" || entry.supplier === filterClient;
      const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
      
      return matchesSearch && matchesClient && matchesStatus;
    });
  }, [searchTerm, filterClient, filterStatus]);

  const stats = useMemo(() => {
    const totalEntries = MOCK_GOODS_ENTRIES.length;
    const pendingEntries = MOCK_GOODS_ENTRIES.filter(entry => entry.status === "pending").length;
    const receivedEntries = MOCK_GOODS_ENTRIES.filter(entry => entry.status === "received").length;
    const verifiedEntries = MOCK_GOODS_ENTRIES.filter(entry => entry.status === "verified").length;
    const totalQuantity = MOCK_GOODS_ENTRIES.reduce((sum, entry) => sum + entry.quantity, 0);
    const avgQuantity = totalQuantity / totalEntries;

    return {
      totalEntries,
      pendingEntries,
      receivedEntries,
      verifiedEntries,
      totalQuantity,
      avgQuantity
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "received":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified":
        return "Verificada";
      case "received":
        return "Recibida";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "received":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <h1 className="text-3xl font-bold text-gray-900">Entradas de Mercancía</h1>
              <p className="text-gray-600 mt-1">Gestión y seguimiento de entradas de mercancía</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-all">
                <Package2 className="w-4 h-4" />
                Nueva Entrada
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Package2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Total Entradas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalEntries}</div>
            <div className="text-xs text-blue-600 mt-1">Este mes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">Pendientes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingEntries}</div>
            <div className="text-xs text-yellow-600 mt-1">Por verificar</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Verificadas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.verifiedEntries}</div>
            <div className="text-xs text-green-600 mt-1">Completadas</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Items Totales</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalQuantity.toLocaleString()}</div>
            <div className="text-xs text-purple-600 mt-1">Promedio: {Math.round(stats.avgQuantity)}</div>
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
                  placeholder="Buscar por ID, proveedor o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los proveedores</option>
                {Array.from(new Set(MOCK_GOODS_ENTRIES.map(entry => entry.supplier))).map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="received">Recibidas</option>
                <option value="verified">Verificadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Package2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Entradas</h3>
                  <p className="text-sm text-gray-500">{filteredEntries.length} entradas encontradas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    O.C. Relacionada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">{entry.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.quantity.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.relatedPO ? (
                        <div className="flex items-center gap-1">
                          <Link className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600 font-medium">{entry.relatedPO}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin O.C.</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {getStatusIcon(entry.status)}
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedEntry(entry)}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Package2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron entradas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Entry Details Modal */}
      <Modal 
        open={!!selectedEntry} 
        onClose={() => setSelectedEntry(null)} 
        title={selectedEntry ? `Entrada ${selectedEntry.id}` : undefined}
      >
        {selectedEntry && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</label>
                <div className="text-sm font-medium text-gray-900">{selectedEntry.supplier}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</label>
                <div className="text-sm text-gray-900">
                  {new Date(selectedEntry.date).toLocaleDateString('es-ES')}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</label>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEntry.status)}`}>
                  {getStatusIcon(selectedEntry.status)}
                  {getStatusLabel(selectedEntry.status)}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</label>
                <div className="text-sm font-bold text-gray-900">{selectedEntry.quantity.toLocaleString()} unidades</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</label>
              <div className="text-sm text-gray-900 mt-1">{selectedEntry.description}</div>
            </div>

            {/* Related Purchase Order */}
            {selectedEntry.relatedPO && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Orden de Compra Relacionada</label>
                <div className="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{selectedEntry.relatedPO}</span>
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Esta entrada está vinculada a la orden de compra especificada
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Historial de Estado</label>
              <div className="mt-2 space-y-2">
                <div className={`flex items-center gap-3 p-2 rounded ${selectedEntry.status === 'verified' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <CheckCircle className={`w-4 h-4 ${selectedEntry.status === 'verified' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${selectedEntry.status === 'verified' ? 'text-green-900 font-medium' : 'text-gray-600'}`}>
                    Verificada
                  </span>
                </div>
                <div className={`flex items-center gap-3 p-2 rounded ${['verified', 'received'].includes(selectedEntry.status) ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <Package className={`w-4 h-4 ${['verified', 'received'].includes(selectedEntry.status) ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${['verified', 'received'].includes(selectedEntry.status) ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                    Recibida
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded bg-yellow-50">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-900 font-medium">Pendiente</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
