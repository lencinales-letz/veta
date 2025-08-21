"use client";

import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import { MOCK_PURCHASE_ORDERS, MOCK_CLIENTS, PurchaseOrder, formatCurrency } from "@/lib/mockData";
import { useState, useMemo } from "react";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function OrdenesCompraPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const filteredPOs = useMemo(() => {
    return MOCK_PURCHASE_ORDERS.filter(po => {
      const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           po.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClient = filterClient === "all" || po.supplier === filterClient;
      const matchesStatus = filterStatus === "all" || po.status === filterStatus;
      
      return matchesSearch && matchesClient && matchesStatus;
    });
  }, [searchTerm, filterClient, filterStatus]);

  const stats = useMemo(() => {
    const totalPOs = MOCK_PURCHASE_ORDERS.length;
    const pendingPOs = MOCK_PURCHASE_ORDERS.filter(po => po.status === "pending").length;
    const receivedPOs = MOCK_PURCHASE_ORDERS.filter(po => po.status === "received").length;
    const completedPOs = MOCK_PURCHASE_ORDERS.filter(po => po.status === "completed").length;
    const totalAmount = MOCK_PURCHASE_ORDERS.reduce((sum, po) => sum + po.amount, 0);
    const avgAmount = totalAmount / totalPOs;

    return {
      totalPOs,
      pendingPOs,
      receivedPOs,
      completedPOs,
      totalAmount,
      avgAmount
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "received":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada";
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
      case "completed":
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
              <h1 className="text-3xl font-bold text-gray-900">Órdenes de Compra</h1>
              <p className="text-gray-600 mt-1">Gestión y seguimiento de órdenes de compra</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-all">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-all">
                <ShoppingCart className="w-4 h-4" />
                Nueva Orden
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Total Órdenes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPOs}</div>
            <div className="text-xs text-blue-600 mt-1">Este mes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">Pendientes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingPOs}</div>
            <div className="text-xs text-yellow-600 mt-1">Requieren seguimiento</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Completadas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedPOs}</div>
            <div className="text-xs text-green-600 mt-1">Este mes</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Valor Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-xs text-purple-600 mt-1">Promedio: {formatCurrency(stats.avgAmount)}</div>
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
                {Array.from(new Set(MOCK_PURCHASE_ORDERS.map(po => po.supplier))).map(supplier => (
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
                <option value="completed">Completadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lista de Órdenes de Compra</h3>
                  <p className="text-sm text-gray-500">{filteredPOs.length} órdenes encontradas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Orden
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
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
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
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{po.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {new Date(po.date).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">{po.supplier}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{po.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(po.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{po.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                        {getStatusIcon(po.status)}
                        {getStatusLabel(po.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedPO(po)}
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

          {filteredPOs.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron órdenes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Purchase Order Details Modal */}
      <Modal 
        open={!!selectedPO} 
        onClose={() => setSelectedPO(null)} 
        title={selectedPO ? `Orden de Compra ${selectedPO.id}` : undefined}
      >
        {selectedPO && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</label>
                <div className="text-sm font-medium text-gray-900">{selectedPO.supplier}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</label>
                <div className="text-sm text-gray-900">
                  {new Date(selectedPO.date).toLocaleDateString('es-ES')}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</label>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPO.status)}`}>
                  {getStatusIcon(selectedPO.status)}
                  {getStatusLabel(selectedPO.status)}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</label>
                <div className="text-sm font-bold text-gray-900">{formatCurrency(selectedPO.amount)}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</label>
              <div className="text-sm text-gray-900 mt-1">{selectedPO.description}</div>
            </div>

            {/* Items Table */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Items de la Orden</label>
              <div className="mt-2 overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPO.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total:</td>
                      <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">{formatCurrency(selectedPO.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
