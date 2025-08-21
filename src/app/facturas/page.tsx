"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import InvoiceAccordion from "@/components/InvoiceAccordion";
import InvoiceDetailsSidebar from "@/components/InvoiceDetailsSidebar";
import { MOCK_INVOICES, InvoiceItem } from "@/lib/mockData";
import { Search, Filter, Download, Plus } from "lucide-react";

export default function FacturasPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filtrar facturas basado en búsqueda y filtros
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === "" || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInvoiceUpdate = (updatedInvoice: InvoiceItem) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    
    // Si hay una factura seleccionada y es la que se actualizó, actualizar también
    if (selectedInvoice && selectedInvoice.id === updatedInvoice.id) {
      setSelectedInvoice(updatedInvoice);
    }
  };

  return (
    <div className="min-h-[100svh] bg-[#f8fafe] flex">
      <Sidebar />
      
      <main className={`ml-64 p-8 transition-all duration-300 ${selectedInvoice ? 'mr-[40%]' : ''} flex-1`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
              <p className="text-gray-600 mt-1">Gestiona todas las facturas del sistema</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" />
                Nueva Factura
              </button>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID de factura o proveedor..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por Estado */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="new">Nueva</option>
                <option value="in_progress">En proceso</option>
                <option value="reviewed">Revisada</option>
                <option value="done">Conciliada</option>
                <option value="rejected">Rechazada</option>
              </select>
            </div>
          </div>

          {/* Stats rápidas con colores sutiles */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{invoices.filter(i => i.status === 'new').length}</div>
              <div className="text-xs text-blue-600">Nuevas</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{invoices.filter(i => i.status === 'in_progress').length}</div>
              <div className="text-xs text-yellow-600">En proceso</div>
            </div>
            <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{invoices.filter(i => i.status === 'reviewed').length}</div>
              <div className="text-xs text-purple-600">Revisadas</div>
            </div>
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{invoices.filter(i => i.status === 'done').length}</div>
              <div className="text-xs text-green-600">Conciliadas</div>
            </div>
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{invoices.filter(i => i.status === 'rejected').length}</div>
              <div className="text-xs text-red-600">Rechazadas</div>
            </div>
          </div>
        </div>

        {/* Lista de Facturas con Acordeones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Lista de Facturas</h3>
                <p className="text-sm text-gray-500">
                  {filteredInvoices.length} de {invoices.length} facturas
                  {searchTerm && ` • Filtrado por "${searchTerm}"`}
                  {statusFilter !== "all" && ` • Estado: ${statusFilter}`}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredInvoices.length > 0 ? (
              <InvoiceAccordion 
                invoices={filteredInvoices} 
                onPreview={setSelectedInvoice}
                isCompact={!!selectedInvoice}
                onInvoiceUpdate={handleInvoiceUpdate}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron facturas</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Intenta ajustar los filtros de búsqueda" 
                    : "No hay facturas disponibles en el sistema"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Panel lateral de detalles */}
      <InvoiceDetailsSidebar 
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onInvoiceUpdate={handleInvoiceUpdate}
      />
    </div>
  );
}
