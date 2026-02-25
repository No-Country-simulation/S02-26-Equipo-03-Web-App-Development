import { CampaignTable } from "@/shared/components/Campaigns/CampaignTable";
import { CampaignSearch } from "@/shared/components/Campaigns/CampaignSearch";
import { Campaign } from "@/shared/components/Campaigns/types/campaign.types";

type Props = {
  campaigns: Campaign[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  onSearch: (_value: string) => void;
  onPageChange: (_page: number) => void;
};

export function CampaignContent({
  campaigns,
  total,
  page,
  pageSize,
  search,
  onSearch,
  onPageChange,
}: Props) {
  return (
    <div className="flex flex-col gap-6 border border-black p-6">
      <CampaignSearch search={search} onSearchChange={onSearch} />
      <CampaignTable
        campaigns={campaigns}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
