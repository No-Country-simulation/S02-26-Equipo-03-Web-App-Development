export type { Campaign, InsertCampaign } from "@/infrastructure/database/schemas/schema";

export interface CampaignReportDTO {
  id: string;
  name: string;
  externalId: string | null;
  platform: string | null;
  status: string;
  adSpend: number;
  revenue: number;
  roas: number;
  cpa: number;
  startDate: Date | null;
  endDate: Date | null;
};

export interface PagCampaignResponse {
  data: CampaignReportDTO[];
  totalCampaigns: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export interface CampaignById {
  campaign: CampaignReportDTO;
  ordersCampaign: OrdersDTO[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

export interface OrdersDTO {
  id: string;
  idOrden: string | null;
  clientName: string | null;
  clientEmail: string | null;
  serviceName: string | null;
  paymentType: string | null;
  sourceName: string | null;
  totalAmount: number;
  status: string;
  orderDate: string | null; //fecha de la orden en formato ISO
  campaignId: string | null;
  projectId: string;
}



