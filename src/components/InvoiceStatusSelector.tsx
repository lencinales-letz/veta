"use client";

import { useState } from "react";
import { ChevronDown, Check, Clock, Eye, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { InvoiceItem } from "@/lib/mockData";

interface InvoiceStatusConfig {
  key: InvoiceItem['status'];
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  nextStates?: InvoiceItem['status'][];
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceItem['status'], InvoiceStatusConfig> = {
  'new': {
    key: 'new',
    label: 'Nueva',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Clock,
    description: 'Factura recién recibida, pendiente de revisión',
    nextStates: ['in_progress', 'rejected']
  },
  'in_progress': {
    key: 'in_progress',
    label: 'En Proceso',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Clock,
    description: 'Factura en proceso de revisión y validación',
    nextStates: ['reviewed', 'rejected']
  },
  'reviewed': {
    key: 'reviewed',
    label: 'Revisada',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Eye,
    description: 'Factura revisada, pendiente de aprobación final',
    nextStates: ['done', 'in_progress']
  },
  'done': {
    key: 'done',
    label: 'Conciliada',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    description: 'Factura completamente procesada y conciliada',
    nextStates: []
  },
  'rejected': {
    key: 'rejected',
    label: 'Rechazada',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle,
    description: 'Factura rechazada por inconsistencias o errores',
    nextStates: ['new', 'in_progress']
  }
};

interface InvoiceStatusSelectorProps {
  currentStatus: InvoiceItem['status'];
  onStatusChange: (newStatus: InvoiceItem['status']) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  allowedStates?: InvoiceItem['status'][];
}

export default function InvoiceStatusSelector({
  currentStatus,
  onStatusChange,
  disabled = false,
  size = 'md',
  showDescription = false,
  allowedStates
}: InvoiceStatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentConfig = INVOICE_STATUS_CONFIG[currentStatus];
  const CurrentIcon = currentConfig.icon;
  
  // Determinar qué estados mostrar
  const availableStates = allowedStates || Object.keys(INVOICE_STATUS_CONFIG) as InvoiceItem['status'][];
  const suggestedStates = currentConfig.nextStates || [];
  
  // Ordenar estados: primero los sugeridos, luego los demás
  const sortedStates = [
    ...suggestedStates.filter(state => availableStates.includes(state)),
    ...availableStates.filter(state => !suggestedStates.includes(state) && state !== currentStatus)
  ];

  const sizeClasses = {
    sm: {
      button: 'px-3 py-1.5 text-xs',
      icon: 'w-3 h-3',
      dropdown: 'text-xs'
    },
    md: {
      button: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
      dropdown: 'text-sm'
    },
    lg: {
      button: 'px-6 py-3 text-base',
      icon: 'w-5 h-5',
      dropdown: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  const handleStatusChange = (newStatus: InvoiceItem['status']) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <div className={`inline-flex items-center gap-2 ${classes.button} ${currentConfig.bgColor} ${currentConfig.borderColor} ${currentConfig.color} border rounded-lg font-medium`}>
        <CurrentIcon className={classes.icon} />
        {currentConfig.label}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 ${classes.button} ${currentConfig.bgColor} ${currentConfig.borderColor} ${currentConfig.color} border rounded-lg font-medium hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        <CurrentIcon className={classes.icon} />
        {currentConfig.label}
        <ChevronDown className={`${classes.icon} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {showDescription && (
        <p className="text-xs text-gray-600 mt-1 max-w-xs">
          {currentConfig.description}
        </p>
      )}

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className={`${classes.dropdown} font-medium text-gray-900`}>
                  Cambiar estado de factura
                </span>
              </div>
              
              {sortedStates.map((status) => {
                const config = INVOICE_STATUS_CONFIG[status];
                const StatusIcon = config.icon;
                const isSuggested = suggestedStates.includes(status);
                
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${
                      isSuggested 
                        ? `${config.bgColor} ${config.borderColor} ${config.color}` 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${isSuggested ? '' : 'opacity-60'}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`${classes.dropdown} font-medium flex items-center gap-2`}>
                        {config.label}
                        {isSuggested && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Sugerido
                          </span>
                        )}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {config.description}
                      </div>
                    </div>
                    {status === currentStatus && (
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
