"use client";

import Sidebar from "@/components/Sidebar";

import StatusDot from "@/components/StatusDot";
import Modal from "@/components/Modal";
import { MOCK_CLIENTS, MOCK_INVOICES, formatCurrency, InvoiceItem, ClientIntegration } from "@/lib/mockData";
import { useMemo, useState } from "react";
import { Plus, CheckCircle, AlertTriangle, Clock, DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [preview, setPreview] = useState<InvoiceItem | null>(null);

  const kpis = useMemo(() => {
    const newCount = invoices.filter((i) => i.status === "new").length;
    const inProgress = invoices.filter((i) => i.status === "in_progress" || i.status === "reviewed").length;
    const done = invoices.filter((i) => i.status === "done").length;
    const rejected = invoices.filter((i) => i.status === "rejected").length;
    const pendingAmount = invoices.filter((i) => i.status !== "done").reduce((sum, inv) => sum + inv.amount, 0);
    const avgMatchRate = invoices.reduce((sum, inv) => sum + inv.matchPercentage, 0) / invoices.length;
    const highPriorityCount = invoices.filter((i) => i.priority === "high" && i.status !== "done").length;
    const processingTime = "2.3 días"; // Mock average
    
    return {
      newCount,
      inProgress,
      done,
      rejected,
      pendingAmount,
      avgMatchRate,
      highPriorityCount,
      processingTime,
      totalInvoices: invoices.length
    };
  }, [invoices]);

  const integrationStatus = useMemo(() => {
    const totalClients = MOCK_CLIENTS.length;
    const erpOnline = MOCK_CLIENTS.filter(c => c.erp === "online").length;
    const billingOnline = MOCK_CLIENTS.filter(c => c.billing === "online").length;
    const otherOnline = MOCK_CLIENTS.filter(c => c.other === "online").length;
    
    return {
      erp: { online: erpOnline, total: totalClients, percentage: Math.round((erpOnline / totalClients) * 100) },
      billing: { online: billingOnline, total: totalClients, percentage: Math.round((billingOnline / totalClients) * 100) },
      other: { online: otherOnline, total: totalClients, percentage: Math.round((otherOnline / totalClients) * 100) }
    };
  }, []);



  return (
    <div className="min-h-[100svh] bg-[#f8fafe]">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard VETA</h1>
              <p className="text-gray-600 mt-1">28 Abril 2025</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-[#e8f5e8] text-[#2d5a2d] rounded-2xl px-6 py-3 text-sm font-medium hover:bg-[#d4f0d4] transition-all">
                <Plus className="w-4 h-4" />
                Upgrade Now →
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Facturas Pendientes */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-1 rounded-full">
                Pendientes
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpis.newCount + kpis.inProgress}</div>
            <div className="text-sm text-gray-600 mt-1">Facturas por procesar</div>
            <div className="text-xs text-blue-600 mt-2">
              {kpis.highPriorityCount} de alta prioridad
                  </div>
                </div>
                
          {/* Monto Pendiente */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
              <span className="text-xs bg-amber-500/10 text-amber-700 px-2 py-1 rounded-full">
                Valor
              </span>
                </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.pendingAmount)}</div>
            <div className="text-sm text-gray-600 mt-1">Monto por conciliar</div>
            <div className="text-xs text-amber-600 mt-2">
              {((kpis.pendingAmount / (kpis.pendingAmount + 100000)) * 100).toFixed(1)}% del total
                  </div>
                </div>
                
          {/* Tasa de Conciliación */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full">
                Match
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpis.avgMatchRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 mt-1">Promedio de coincidencia</div>
            <div className="text-xs text-green-600 mt-2">
              +5.2% vs mes anterior
                  </div>
                </div>

          {/* Tiempo Promedio */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs bg-purple-500/10 text-purple-700 px-2 py-1 rounded-full">
                Tiempo
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpis.processingTime}</div>
            <div className="text-sm text-gray-600 mt-1">Tiempo promedio</div>
            <div className="text-xs text-purple-600 mt-2">
              -12% vs mes anterior
                  </div>
                </div>
              </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Estado de Integraciones */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Estado de Integraciones por Cliente</h3>
            </div>
            
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ERP
                    </th>
                    <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facturación
                    </th>
                    <th className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Otros
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_CLIENTS.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-25">
                      <td className="py-3 pr-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      </td>
                      <td className="py-3 text-center">
                        <StatusDot status={client.erp} />
                      </td>
                      <td className="py-3 text-center">
                        <StatusDot status={client.billing} />
                      </td>
                      <td className="py-3 text-center">
                        <StatusDot status={client.other} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{integrationStatus.erp.percentage}%</div>
                    <div className="text-xs text-gray-500">ERP activo</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{integrationStatus.billing.percentage}%</div>
                    <div className="text-xs text-gray-500">Facturación activa</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{integrationStatus.other.percentage}%</div>
                    <div className="text-xs text-gray-500">Otros activos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                    {/* Resumen del día */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Resumen del Día</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="text-center p-4 bg-blue-50 rounded-xl flex flex-col justify-center">
                <div className="text-2xl font-bold text-blue-600">{kpis.newCount}</div>
                <div className="text-xs text-gray-600">Nuevas</div>
                    </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl flex flex-col justify-center">
                <div className="text-2xl font-bold text-amber-600">{kpis.inProgress}</div>
                <div className="text-xs text-gray-600">En proceso</div>
                    </div>
              <div className="text-center p-4 bg-green-50 rounded-xl flex flex-col justify-center">
                <div className="text-2xl font-bold text-green-600">{kpis.done}</div>
                <div className="text-xs text-gray-600">Conciliadas</div>
                    </div>
              <div className="text-center p-4 bg-red-50 rounded-xl flex flex-col justify-center">
                <div className="text-2xl font-bold text-red-600">{kpis.rejected}</div>
                <div className="text-xs text-gray-600">Rechazadas</div>
              </div>
            </div>
          </div>
              </div>
              
        {/* Invoice Inbox - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <span className="text-lg">📋</span>
              </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Inbox de Facturas</h3>
                  <p className="text-sm text-gray-500">{invoices.length} facturas en total</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="/facturas" 
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ver todas las facturas →
                </a>
              </div>
              </div>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    O.C.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignado a
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Encargado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.map((invoice) => {
                  const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId);
                  const receivedDate = new Date(invoice.receivedAt);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {receivedDate.toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {receivedDate.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.supplier}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.hasPO 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.hasPO ? '✓ Sí' : '✗ No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.hasEntry 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.hasEntry ? '✓ Sí' : '✗ No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`text-sm font-medium ${
                            invoice.matchPercentage >= 90 ? 'text-green-600' :
                            invoice.matchPercentage >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {invoice.matchPercentage}%
                          </div>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                invoice.matchPercentage >= 90 ? 'bg-green-500' :
                                invoice.matchPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${invoice.matchPercentage}%` }}
                            ></div>
                    </div>
                  </div>
                      </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.assignedTo || 'Sin asignar'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          invoice.status === 'reviewed' ? 'bg-purple-100 text-purple-800' :
                          invoice.status === 'done' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status === 'new' ? 'Nueva' :
                           invoice.status === 'in_progress' ? 'En proceso' :
                           invoice.status === 'reviewed' ? 'Revisada' :
                           invoice.status === 'done' ? 'Conciliada' :
                           'Rechazada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.priority === 'high' ? 'bg-red-100 text-red-800' :
                          invoice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.priority === 'high' ? 'Alta' :
                           invoice.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          {invoice.responsiblePerson ? (
                            <div className="relative group">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {invoice.responsiblePerson.split(' ').map(name => name[0]).join('').toUpperCase()}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                {invoice.responsiblePerson}
              </div>
            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                              ?
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setPreview(invoice)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Ver
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Procesar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.id ? `Factura ${preview.id}` : undefined}>
        <div className="aspect-[4/3] w-full rounded-lg bg-[radial-gradient(100%_100%_at_50%_0%,#c7d2fe_0%,transparent_60%),radial-gradient(100%_100%_at_50%_100%,#93c5fd_0%,transparent_60%)] flex items-center justify-center text-gray-500">
          Vista previa PDF simulada
        </div>
      </Modal>
    </div>
  );
}


