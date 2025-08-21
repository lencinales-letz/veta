"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Package, CheckCircle, Clock } from "lucide-react";
import { 
  InvoiceItem, 
  ClientIntegration, 
  formatCurrency,
  MOCK_PURCHASE_ORDERS,
  MOCK_GOODS_ENTRIES,
  MOCK_CLIENTS 
} from "@/lib/mockData";
import InvoiceStatusSelector from "./InvoiceStatusSelector";

interface InvoiceAccordionProps {
  invoices: InvoiceItem[];
  onPreview?: (invoice: InvoiceItem) => void;
  isCompact?: boolean;
  onInvoiceUpdate?: (updatedInvoice: InvoiceItem) => void;
}

interface InvoiceRowProps {
  invoice: InvoiceItem;
  client: ClientIntegration | undefined;
  onPreview?: (invoice: InvoiceItem) => void;
  isCompact?: boolean;
  onInvoiceUpdate?: (updatedInvoice: InvoiceItem) => void;
}

function InvoiceRow({ invoice, client, onPreview, isCompact = false, onInvoiceUpdate }: InvoiceRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const receivedDate = new Date(invoice.receivedAt);





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

  return (
    <div className="border border-gray-200 rounded-lg mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Main Invoice Row */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Expand/Collapse Icon */}
            <div className="flex items-center justify-center w-6 h-6">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </div>

            {/* Invoice Info */}
            <div className={`grid gap-4 flex-1 items-center ${
              isCompact ? 'grid-cols-8' : 'grid-cols-12'
            }`}>
              {/* Fecha */}
              <div className="col-span-1 flex items-center">
                <div>
                  <div className="text-sm text-gray-900">
                    {receivedDate.toLocaleDateString('es-ES')}
                  </div>
                  {!isCompact && (
                    <div className="text-xs text-gray-500">
                      {receivedDate.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Factura ID */}
              <div className="col-span-1 flex items-center">
                <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
              </div>

              {/* Proveedor */}
              <div className="col-span-1 flex items-center">
                <div className="text-sm text-gray-900 truncate">{invoice.supplier}</div>
              </div>

              {/* Cliente - Solo en vista completa */}
              {!isCompact && (
                <div className="col-span-1 flex items-center">
                  <div className="text-sm text-gray-900">{client?.name || 'N/A'}</div>
                </div>
              )}

              {/* Monto */}
              <div className="col-span-1 flex items-center">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
              </div>

              {/* O.C. - Solo en vista completa - Solo color del texto */}
              {!isCompact && (
                <div className="col-span-1 flex items-center">
                  <span className={`text-xs font-medium ${
                    invoice.hasPO 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {invoice.hasPO ? '✓ Sí' : '✗ No'}
                  </span>
                </div>
              )}

              {/* Entrada - Solo en vista completa - Solo color del texto */}
              {!isCompact && (
                <div className="col-span-1 flex items-center">
                  <span className={`text-xs font-medium ${
                    invoice.hasEntry 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {invoice.hasEntry ? '✓ Sí' : '✗ No'}
                  </span>
                </div>
              )}

              {/* Match % - Solo color del texto */}
              <div className="col-span-1 flex items-center">
                <span className={`text-xs font-medium ${
                  invoice.matchPercentage >= 90 ? 'text-green-600' :
                  invoice.matchPercentage >= 70 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {invoice.matchPercentage}%
                </span>
              </div>

              {/* Estado - MÁS PROMINENTE */}
              <div className="col-span-1 flex items-center">
                <InvoiceStatusSelector
                  currentStatus={invoice.status}
                  onStatusChange={handleStatusChange}
                  size="sm"
                />
              </div>

              {/* Prioridad - Solo en vista completa - Solo color del texto */}
              {!isCompact && (
                <div className="col-span-1 flex items-center">
                  <span className={`text-xs font-medium ${
                    invoice.priority === 'high' ? 'text-red-600' :
                    invoice.priority === 'medium' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {priorityConfig[invoice.priority].text}
                  </span>
                </div>
              )}

              {/* Responsable - Solo en vista completa */}
              {!isCompact && (
                <div className="col-span-1 flex items-center justify-center">
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
              )}

              {/* Acciones */}
              <div className="col-span-1 flex items-center justify-end">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview?.(invoice);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 mr-2 text-sm"
                >
                  Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4">
            {/* Resumen compacto de Match */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Análisis de Coincidencias</h4>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{invoice.matchPercentage}%</div>
                  <div className="text-xs text-gray-500">Match Total</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-green-700">
                    {formatCurrency(Math.round(invoice.amount * invoice.matchPercentage / 100))}
                  </div>
                  <div className="text-xs text-green-600">Con Match</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-red-700">
                    {formatCurrency(Math.round(invoice.amount * (100 - invoice.matchPercentage) / 100))}
                  </div>
                  <div className="text-xs text-red-600">Sin Match</div>
                </div>
              </div>

              {/* Barra de progreso compacta */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    invoice.matchPercentage >= 90 ? 'bg-green-500' :
                    invoice.matchPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${invoice.matchPercentage}%` }}
                ></div>
              </div>

              {/* Item Details compacto */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Detalles de Items:</div>
                
                {/* Simulamos algunos items con diferentes porcentajes de match */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                    <span className="text-gray-700">Válvulas industriales (x10)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">100% Match</span>
                      <span className="text-gray-600">{formatCurrency(8500)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                    <span className="text-gray-700">Tuberías de acero (x25)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-medium">85% Match</span>
                      <span className="text-gray-600">{formatCurrency(4350)}</span>
                    </div>
                  </div>
                  {invoice.matchPercentage < 100 && (
                    <div className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                      <span className="text-gray-700">Items sin coincidencia</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">0% Match</span>
                        <span className="text-gray-600">
                          {formatCurrency(Math.round(invoice.amount * (100 - invoice.matchPercentage) / 100))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvoiceAccordion({ invoices, onPreview, isCompact = false, onInvoiceUpdate }: InvoiceAccordionProps) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Spacer para alinear con el icono de expansión */}
          <div className="w-6 h-6"></div>
          
          {/* Grid de headers alineado con el contenido */}
          <div className={`grid gap-4 flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider ${
            isCompact ? 'grid-cols-8' : 'grid-cols-12'
          }`}>
            <div className="col-span-1 flex items-center">Fecha</div>
            <div className="col-span-1 flex items-center">Factura</div>
            <div className="col-span-1 flex items-center">Proveedor</div>
            {!isCompact && <div className="col-span-1 flex items-center">Cliente</div>}
            <div className="col-span-1 flex items-center">Monto</div>
            {!isCompact && <div className="col-span-1 flex items-center">O.C.</div>}
            {!isCompact && <div className="col-span-1 flex items-center">Entrada</div>}
            <div className="col-span-1 flex items-center">Match %</div>
            <div className="col-span-1 flex items-center">Estado</div>
            {!isCompact && <div className="col-span-1 flex items-center">Prioridad</div>}
            {!isCompact && <div className="col-span-1 flex items-center justify-center">Responsable</div>}
            <div className="col-span-1 flex items-center justify-end">Acciones</div>
          </div>
        </div>
      </div>

      {/* Invoice Rows */}
      {invoices.map((invoice) => {
        const client = MOCK_CLIENTS.find(c => c.id === invoice.clientId);
        return (
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            client={client}
            onPreview={onPreview}
            isCompact={isCompact}
            onInvoiceUpdate={onInvoiceUpdate}
          />
        );
      })}
    </div>
  );
}
