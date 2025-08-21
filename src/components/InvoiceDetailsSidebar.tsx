"use client";

import { X, FileText, Package, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { 
  InvoiceItem, 
  formatCurrency,
  MOCK_PURCHASE_ORDERS,
  MOCK_GOODS_ENTRIES,
  MOCK_CLIENTS 
} from "@/lib/mockData";
import InvoiceStatusSelector from "./InvoiceStatusSelector";

interface InvoiceDetailsSidebarProps {
  invoice: InvoiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onInvoiceUpdate?: (updatedInvoice: InvoiceItem) => void;
}

export default function InvoiceDetailsSidebar({ invoice, isOpen, onClose, onInvoiceUpdate }: InvoiceDetailsSidebarProps) {
  if (!invoice || !isOpen) return null;

  const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId);
  const relatedPOs = MOCK_PURCHASE_ORDERS.filter(po => 
    invoice.relatedPOs?.includes(po.id)
  );
  const relatedEntries = MOCK_GOODS_ENTRIES.filter(entry => 
    invoice.relatedEntries?.includes(entry.id)
  );

  const statusConfig = {
    'new': { text: 'Nueva', className: 'bg-blue-100 text-blue-800' },
    'in_progress': { text: 'En proceso', className: 'bg-yellow-100 text-yellow-800' },
    'reviewed': { text: 'Revisada', className: 'bg-purple-100 text-purple-800' },
    'done': { text: 'Conciliada', className: 'bg-green-100 text-green-800' },
    'rejected': { text: 'Rechazada', className: 'bg-red-100 text-red-800' }
  };

  const priorityConfig = {
    'high': { text: 'Alta', className: 'bg-red-100 text-red-800' },
    'medium': { text: 'Media', className: 'bg-yellow-100 text-yellow-800' },
    'low': { text: 'Baja', className: 'bg-gray-100 text-gray-800' }
  };

  const handleStatusChange = (newStatus: InvoiceItem['status']) => {
    if (onInvoiceUpdate) {
      const updatedInvoice = { ...invoice, status: newStatus };
      onInvoiceUpdate(updatedInvoice);
    }
  };

  const poStatusConfig = {
    'pending': { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
    'received': { text: 'Recibida', className: 'bg-blue-100 text-blue-800', icon: Package },
    'completed': { text: 'Completada', className: 'bg-green-100 text-green-800', icon: CheckCircle }
  };

  const entryStatusConfig = {
    'pending': { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
    'received': { text: 'Recibida', className: 'bg-blue-100 text-blue-800', icon: Package },
    'verified': { text: 'Verificada', className: 'bg-green-100 text-green-800', icon: CheckCircle }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[40%] bg-white shadow-2xl border-l border-gray-200 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          {/* Top row with invoice info and close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{invoice.id}</h2>
                <p className="text-sm text-gray-600">{invoice.supplier}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Status selector - prominent positioning */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado de la Factura
              </span>
              <InvoiceStatusSelector
                currentStatus={invoice.status}
                onStatusChange={handleStatusChange}
                size="lg"
                showDescription={true}
              />
            </div>
            
            {/* Quick stats */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</div>
              <div className="text-sm text-gray-600">
                Match: <span className={`font-medium ${
                  invoice.matchPercentage >= 90 ? 'text-green-600' :
                  invoice.matchPercentage >= 70 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>{invoice.matchPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - PDF Viewer (Fixed) */}
          <div className="w-1/2 p-4 border-r border-gray-200 bg-gray-50">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Vista Previa PDF</h3>
              </div>
              <div className="flex-1 rounded-lg bg-[radial-gradient(100%_100%_at_50%_0%,#c7d2fe_0%,transparent_60%),radial-gradient(100%_100%_at_50%_100%,#93c5fd_0%,transparent_60%)] flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">Vista previa PDF</p>
                  <p className="text-xs text-gray-400 mt-1">{invoice.id}</p>
                  <p className="text-xs text-gray-400">{invoice.supplier}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Information with Scroll */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* General Information */}
              {invoice.extractedData && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📄</span>
                    <h3 className="text-sm font-semibold text-gray-900">Información General</h3>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(invoice.extractedData.general).map(([key, detail]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <span className="font-medium text-gray-700">{detail.field}:</span>
                        <div className="flex items-center gap-2">
                          <span className={detail.isMatch ? 'text-green-700' : 'text-red-700'}>
                            {typeof detail.invoiceValue === 'number' ? formatCurrency(detail.invoiceValue) : detail.invoiceValue}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${detail.isMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Line Items from Invoice */}
              {invoice.extractedData?.lineItems && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📋</span>
                    <h3 className="text-sm font-semibold text-gray-900">Items de Factura</h3>
                  </div>
                  <div className="space-y-3">
                    {invoice.extractedData.lineItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded p-3">
                        <div className="text-xs font-medium text-gray-800 mb-2">Item {index + 1}</div>
                        <div className="space-y-1">
                          {Object.entries(item).map(([key, detail]) => (
                            <div key={key} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">{detail.field}:</span>
                              <div className="flex items-center gap-2">
                                <span className={detail.isMatch ? 'text-green-700' : 'text-red-700'}>
                                  {typeof detail.invoiceValue === 'number' ? formatCurrency(detail.invoiceValue) : detail.invoiceValue}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${detail.isMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Órdenes de Compra ({relatedPOs.length})</h3>
                </div>
                
                {relatedPOs.length > 0 ? (
                  <div className="space-y-3">
                    {relatedPOs.map((po) => {
                      const statusInfo = poStatusConfig[po.status];
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div key={po.id} className="border border-gray-200 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium text-gray-900">{po.id}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{po.description}</p>
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-500">Fecha: {new Date(po.date).toLocaleDateString('es-ES')}</span>
                            <span className="font-medium text-gray-900">{formatCurrency(po.amount)}</span>
                          </div>
                          
                          {/* Items con match indicators */}
                          <div className="space-y-1">
                            {po.items.map((item, idx) => {
                              // Simulate match with invoice items
                              const hasMatch = invoice.extractedData?.lineItems.some(invItem => 
                                invItem.description.invoiceValue.toString().toLowerCase().includes(item.description.toLowerCase())
                              );
                              return (
                                <div key={item.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                                  <span className="text-gray-700">{item.description} (x{item.quantity})</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{formatCurrency(item.total)}</span>
                                    <div className={`w-2 h-2 rounded-full ${hasMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs">No hay órdenes de compra relacionadas</p>
                  </div>
                )}
              </div>

              {/* Entries */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Entradas ({relatedEntries.length})</h3>
                </div>
                
                {relatedEntries.length > 0 ? (
                  <div className="space-y-3">
                    {relatedEntries.map((entry) => {
                      const statusInfo = entryStatusConfig[entry.status];
                      const StatusIcon = statusInfo.icon;
                      // Simulate match with invoice
                      const hasQuantityMatch = Math.random() > 0.3; // Mock match logic
                      return (
                        <div key={entry.id} className="border border-gray-200 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium text-gray-900">{entry.id}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.text}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{entry.description}</p>
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span className="text-gray-500">Fecha: {new Date(entry.date).toLocaleDateString('es-ES')}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700">Cantidad: {entry.quantity}</span>
                              <div className={`w-2 h-2 rounded-full ${hasQuantityMatch ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </div>
                          </div>
                          {entry.relatedPO && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              Relacionada con: <span className="font-medium">{entry.relatedPO}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs">No hay entradas relacionadas</p>
                  </div>
                )}
              </div>

              {/* Summary/Status at bottom */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📊</span>
                  <h3 className="text-sm font-semibold text-gray-900">Resumen de Estado</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-900">{invoice.matchPercentage}%</div>
                    <div className="text-xs text-gray-600">Match General</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(invoice.amount)}</div>
                    <div className="text-xs text-gray-600">Total Factura</div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-100">
                  <span className={`text-sm font-medium ${
                    invoice.priority === 'high' ? 'text-red-600' :
                    invoice.priority === 'medium' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    Prioridad: {priorityConfig[invoice.priority].text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
