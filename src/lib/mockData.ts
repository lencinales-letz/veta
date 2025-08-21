export type ClientIntegration = {
  id: string;
  name: string;
  erp: "online" | "degraded" | "offline";
  billing: "online" | "degraded" | "offline";
  other: "online" | "degraded" | "offline";
  erpSystem?: string;
  billingSystem?: string;
  otherSystems?: string[];
  reconciledInvoices: number;
  monthlyPackage: {
    purchased: number;    // Total de facturas compradas en el paquete mensual
    received: number;     // Facturas que han llegado/sido recibidas
    processed: number;    // Facturas que se han causado/procesado
    remaining: number;    // Facturas que aún le quedan por usar
  };
};

export type PurchaseOrder = {
  id: string;
  date: string;
  supplier: string;
  description: string;
  amount: number;
  status: "pending" | "received" | "completed";
  items: PurchaseOrderItem[];
};

export type PurchaseOrderItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type GoodsEntry = {
  id: string;
  date: string;
  supplier: string;
  description: string;
  quantity: number;
  status: "pending" | "received" | "verified";
  relatedPO?: string;
};

export type MatchDetail = {
  field: string;
  invoiceValue: string | number;
  systemValue: string | number;
  isMatch: boolean;
  confidence: number; // 0-100
};

export type InvoiceExtractedData = {
  general: {
    invoiceNumber: MatchDetail;
    date: MatchDetail;
    supplier: MatchDetail;
    total: MatchDetail;
    currency: MatchDetail;
  };
  lineItems: Array<{
    description: MatchDetail;
    quantity: MatchDetail;
    unitPrice: MatchDetail;
    total: MatchDetail;
  }>;
};

export type InvoiceItem = {
  id: string;
  supplier: string;
  amount: number; // in USD
  currency?: string;
  receivedAt: string; // ISO
  hasPO: boolean;
  hasGRN: boolean; // goods receipt note
  hasEntry: boolean; // entrada/receipt
  isProcessed: boolean;
  matchPercentage: number; // 0-100
  assignedTo?: string;
  responsiblePerson?: string; // encargado de la factura
  status: "new" | "in_progress" | "reviewed" | "done" | "rejected";
  priority: "low" | "medium" | "high";
  clientId: string;
  relatedPOs?: string[]; // IDs de órdenes de compra relacionadas
  relatedEntries?: string[]; // IDs de entradas relacionadas
  extractedData?: InvoiceExtractedData; // Datos extraídos del PDF
};

export const MOCK_CLIENTS: ClientIntegration[] = [
  { 
    id: "c_001", 
    name: "Globex Corp", 
    erp: "online", 
    billing: "online", 
    other: "degraded",
    erpSystem: "SAP S/4HANA",
    billingSystem: "QuickBooks Enterprise",
    otherSystems: ["Salesforce", "HubSpot"],
    reconciledInvoices: 342,
    monthlyPackage: {
      purchased: 500,
      received: 387,
      processed: 342,
      remaining: 158
    }
  },
  { 
    id: "c_002", 
    name: "Initech", 
    erp: "degraded", 
    billing: "online", 
    other: "online",
    erpSystem: "Oracle NetSuite",
    billingSystem: "Xero Professional",
    otherSystems: ["Microsoft Dynamics", "Zoho CRM"],
    reconciledInvoices: 186,
    monthlyPackage: {
      purchased: 300,
      received: 198,
      processed: 186,
      remaining: 114
    }
  },
  { 
    id: "c_003", 
    name: "Hooli", 
    erp: "online", 
    billing: "offline", 
    other: "degraded",
    erpSystem: "Microsoft Dynamics 365",
    billingSystem: "Sage Intacct",
    otherSystems: ["ServiceNow"],
    reconciledInvoices: 298,
    monthlyPackage: {
      purchased: 400,
      received: 315,
      processed: 298,
      remaining: 102
    }
  },
  { 
    id: "c_004", 
    name: "Umbrella Group", 
    erp: "online", 
    billing: "online", 
    other: "online",
    erpSystem: "Epicor ERP",
    billingSystem: "FreshBooks",
    otherSystems: ["Salesforce", "Pipedrive", "Slack"],
    reconciledInvoices: 445,
    monthlyPackage: {
      purchased: 600,
      received: 478,
      processed: 445,
      remaining: 155
    }
  },
  { 
    id: "c_005", 
    name: "Wayne Enterprises", 
    erp: "online", 
    billing: "degraded", 
    other: "online",
    erpSystem: "Infor CloudSuite",
    billingSystem: "Wave Accounting",
    otherSystems: ["HubSpot", "Zendesk"],
    reconciledInvoices: 567,
    monthlyPackage: {
      purchased: 750,
      received: 612,
      processed: 567,
      remaining: 183
    }
  },
  { 
    id: "c_006", 
    name: "Stark Industries", 
    erp: "degraded", 
    billing: "online", 
    other: "offline",
    erpSystem: "IFS Applications",
    billingSystem: "Zoho Books",
    otherSystems: ["Monday.com"],
    reconciledInvoices: 223,
    monthlyPackage: {
      purchased: 350,
      received: 245,
      processed: 223,
      remaining: 127
    }
  }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-2024-001",
    date: "2024-04-15",
    supplier: "ACME Parts",
    description: "Componentes industriales",
    amount: 12850,
    status: "received",
    items: [
      { id: "po1_item1", description: "Válvulas industriales", quantity: 10, unitPrice: 850, total: 8500 },
      { id: "po1_item2", description: "Tuberías de acero", quantity: 25, unitPrice: 174, total: 4350 }
    ]
  },
  {
    id: "PO-2024-002",
    date: "2024-04-10",
    supplier: "Wayne Logistics",
    description: "Material de empaque",
    amount: 7800,
    status: "completed",
    items: [
      { id: "po2_item1", description: "Cajas de cartón", quantity: 500, unitPrice: 12, total: 6000 },
      { id: "po2_item2", description: "Material de protección", quantity: 100, unitPrice: 18, total: 1800 }
    ]
  },
  {
    id: "PO-2024-003",
    date: "2024-04-12",
    supplier: "Wonka Supply",
    description: "Suministros de oficina",
    amount: 2150,
    status: "completed",
    items: [
      { id: "po3_item1", description: "Papel bond", quantity: 50, unitPrice: 25, total: 1250 },
      { id: "po3_item2", description: "Suministros varios", quantity: 1, unitPrice: 900, total: 900 }
    ]
  },
  {
    id: "PO-2024-004",
    date: "2024-04-08",
    supplier: "Global Supplies",
    description: "Equipamiento técnico",
    amount: 18250,
    status: "received",
    items: [
      { id: "po4_item1", description: "Computadoras portátiles", quantity: 5, unitPrice: 2500, total: 12500 },
      { id: "po4_item2", description: "Monitores", quantity: 8, unitPrice: 719, total: 5750 }
    ]
  },
  {
    id: "PO-2024-005",
    date: "2024-04-06",
    supplier: "Office Depot",
    description: "Material de oficina",
    amount: 3400,
    status: "received",
    items: [
      { id: "po5_item1", description: "Escritorios ejecutivos", quantity: 2, unitPrice: 1200, total: 2400 },
      { id: "po5_item2", description: "Sillas ergonómicas", quantity: 4, unitPrice: 250, total: 1000 }
    ]
  },
  {
    id: "PO-2024-006",
    date: "2024-04-04",
    supplier: "Energy Corp",
    description: "Equipos eléctricos",
    amount: 35800,
    status: "completed",
    items: [
      { id: "po6_item1", description: "Transformadores", quantity: 2, unitPrice: 15000, total: 30000 },
      { id: "po6_item2", description: "Cables especializados", quantity: 100, unitPrice: 58, total: 5800 }
    ]
  }
];

export const MOCK_GOODS_ENTRIES: GoodsEntry[] = [
  {
    id: "GRN-2024-001",
    date: "2024-04-16",
    supplier: "ACME Parts",
    description: "Recepción de componentes industriales",
    quantity: 35,
    status: "verified",
    relatedPO: "PO-2024-001"
  },
  {
    id: "GRN-2024-002",
    date: "2024-04-14",
    supplier: "Wayne Logistics",
    description: "Recepción de material de empaque",
    quantity: 600,
    status: "verified",
    relatedPO: "PO-2024-002"
  },
  {
    id: "GRN-2024-003",
    date: "2024-04-13",
    supplier: "Wonka Supply",
    description: "Recepción de suministros de oficina",
    quantity: 51,
    status: "verified",
    relatedPO: "PO-2024-003"
  },
  {
    id: "GRN-2024-004",
    date: "2024-04-11",
    supplier: "Global Supplies",
    description: "Recepción de equipamiento técnico",
    quantity: 13,
    status: "received",
    relatedPO: "PO-2024-004"
  },
  {
    id: "GRN-2024-005",
    date: "2024-04-09",
    supplier: "Office Depot",
    description: "Recepción de material de oficina",
    quantity: 6,
    status: "pending",
    relatedPO: "PO-2024-005"
  },
  {
    id: "GRN-2024-006",
    date: "2024-04-07",
    supplier: "Energy Corp",
    description: "Recepción de equipos eléctricos",
    quantity: 102,
    status: "verified",
    relatedPO: "PO-2024-006"
  }
];

export const MOCK_INVOICES: InvoiceItem[] = [
  { 
    id: "INV-10452", 
    supplier: "ACME Parts", 
    amount: 12850, 
    receivedAt: new Date().toISOString(), 
    hasPO: true, 
    hasGRN: false, 
    hasEntry: false,
    isProcessed: false,
    matchPercentage: 95,
    status: "new",
    priority: "high",
    clientId: "c_001",
    responsiblePerson: "Sandra Morales",
    relatedPOs: ["PO-2024-001"],
    relatedEntries: ["GRN-2024-001"],
    extractedData: {
      general: {
        invoiceNumber: { field: "Número de Factura", invoiceValue: "INV-10452", systemValue: "INV-10452", isMatch: true, confidence: 100 },
        date: { field: "Fecha", invoiceValue: "2024-04-28", systemValue: "2024-04-28", isMatch: true, confidence: 100 },
        supplier: { field: "Proveedor", invoiceValue: "ACME Parts", systemValue: "ACME Parts Inc.", isMatch: true, confidence: 95 },
        total: { field: "Total", invoiceValue: 12850, systemValue: 12850, isMatch: true, confidence: 100 },
        currency: { field: "Moneda", invoiceValue: "USD", systemValue: "USD", isMatch: true, confidence: 100 }
      },
      lineItems: [
        {
          description: { field: "Descripción", invoiceValue: "Válvulas industriales", systemValue: "Válvulas industriales", isMatch: true, confidence: 100 },
          quantity: { field: "Cantidad", invoiceValue: 10, systemValue: 10, isMatch: true, confidence: 100 },
          unitPrice: { field: "Precio Unitario", invoiceValue: 850, systemValue: 850, isMatch: true, confidence: 100 },
          total: { field: "Total Línea", invoiceValue: 8500, systemValue: 8500, isMatch: true, confidence: 100 }
        },
        {
          description: { field: "Descripción", invoiceValue: "Tuberías de acero", systemValue: "Tuberías de acero", isMatch: true, confidence: 100 },
          quantity: { field: "Cantidad", invoiceValue: 25, systemValue: 25, isMatch: true, confidence: 100 },
          unitPrice: { field: "Precio Unitario", invoiceValue: 174, systemValue: 174, isMatch: true, confidence: 100 },
          total: { field: "Total Línea", invoiceValue: 4350, systemValue: 4350, isMatch: true, confidence: 100 }
        }
      ]
    }
  },
  { 
    id: "INV-10453", 
    supplier: "Stark Industries", 
    amount: 45600, 
    receivedAt: new Date(Date.now()-3600e3).toISOString(), 
    hasPO: false, 
    hasGRN: false, 
    hasEntry: false,
    isProcessed: false,
    matchPercentage: 78,
    status: "new",
    priority: "high",
    clientId: "c_002",
    responsiblePerson: "Roberto Silva",
    relatedPOs: [],
    relatedEntries: []
  },
  { 
    id: "INV-10454", 
    supplier: "Wayne Logistics", 
    amount: 7800, 
    receivedAt: new Date(Date.now()-6*3600e3).toISOString(), 
    hasPO: true, 
    hasGRN: true, 
    hasEntry: true,
    isProcessed: false,
    matchPercentage: 100,
    status: "in_progress", 
    assignedTo: "María García",
    priority: "medium",
    clientId: "c_001",
    responsiblePerson: "Sandra Morales",
    relatedPOs: ["PO-2024-002"],
    relatedEntries: ["GRN-2024-002"]
  },
  { 
    id: "INV-10455", 
    supplier: "Wonka Supply", 
    amount: 2150, 
    receivedAt: new Date(Date.now()-12*3600e3).toISOString(), 
    hasPO: true, 
    hasGRN: false, 
    hasEntry: true,
    isProcessed: true,
    matchPercentage: 100,
    status: "done", 
    assignedTo: "Carlos López",
    priority: "low",
    clientId: "c_003",
    responsiblePerson: "Patricia Vega",
    relatedPOs: ["PO-2024-003"],
    relatedEntries: ["GRN-2024-003"]
  },
  { 
    id: "INV-10456", 
    supplier: "Global Supplies", 
    amount: 18250, 
    receivedAt: new Date(Date.now()-18*3600e3).toISOString(), 
    hasPO: true, 
    hasGRN: true, 
    hasEntry: false,
    isProcessed: false,
    matchPercentage: 85,
    status: "reviewed", 
    assignedTo: "Ana Martínez",
    priority: "medium",
    clientId: "c_004",
    responsiblePerson: "Diego Ramírez",
    relatedPOs: ["PO-2024-004"],
    relatedEntries: ["GRN-2024-004"]
  },
  { 
    id: "INV-10457", 
    supplier: "Tech Solutions", 
    amount: 6750, 
    receivedAt: new Date(Date.now()-24*3600e3).toISOString(), 
    hasPO: false, 
    hasGRN: false, 
    hasEntry: false,
    isProcessed: false,
    matchPercentage: 45,
    status: "rejected", 
    assignedTo: "Pedro Rodríguez",
    priority: "low",
    clientId: "c_002",
    responsiblePerson: "Roberto Silva",
    relatedPOs: [],
    relatedEntries: []
  },
  { 
    id: "INV-10458", 
    supplier: "Office Depot", 
    amount: 3400, 
    receivedAt: new Date(Date.now()-30*3600e3).toISOString(), 
    hasPO: true, 
    hasGRN: false, 
    hasEntry: false,
    isProcessed: false,
    matchPercentage: 92,
    status: "new",
    priority: "low",
    clientId: "c_003",
    responsiblePerson: "Patricia Vega",
    relatedPOs: ["PO-2024-005"],
    relatedEntries: ["GRN-2024-005"]
  },
  { 
    id: "INV-10459", 
    supplier: "Energy Corp", 
    amount: 35800, 
    receivedAt: new Date(Date.now()-36*3600e3).toISOString(), 
    hasPO: true, 
    hasGRN: true, 
    hasEntry: true,
    isProcessed: true,
    matchPercentage: 100,
    status: "done", 
    assignedTo: "Laura Fernández",
    priority: "high",
    clientId: "c_001",
    responsiblePerson: "Sandra Morales",
    relatedPOs: ["PO-2024-006"],
    relatedEntries: ["GRN-2024-006"]
  }
];

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(amount);
}


