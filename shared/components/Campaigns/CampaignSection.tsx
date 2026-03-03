"use client";

import { CAMPAIGNS_MOCK } from "./mock/campaign.mock";
import { CampaignStats } from "@/shared/components/Campaigns/CampaignStats";
import { CampaignHeader } from "@/shared/components/Campaigns/CampaignHeader";
import { CampaignTabs } from "@/shared/components/Campaigns/CampaignTabs";
import { CampaignContent } from "@/shared/components/Campaigns/CampaignContent";
import { useCampaignFilters } from "@/shared/components/Campaigns/hooks/useCampaignFilters";

export function CampaignSection() {
  const { search, page, tab, campaigns, total, pageSize, setPage, setTab, handleSearch } =
    useCampaignFilters(CAMPAIGNS_MOCK);

  return (
    <section className="flex min-h-full flex-col gap-6 px-6 py-6">
      <CampaignHeader />
      <CampaignStats />
      <div className="w-full">
        <CampaignTabs activeTab={tab} onChange={setTab} />

        <div className="py-6">
          {tab === "all" && (
            <CampaignContent
              campaigns={campaigns}
              total={total}
              page={page}
              pageSize={pageSize}
              search={search}
              onSearch={handleSearch}
              onPageChange={setPage}
            />
          )}

          {tab === "low" && (
            <CampaignContent
              campaigns={campaigns}
              total={total}
              page={page}
              pageSize={pageSize}
              search={search}
              onSearch={handleSearch}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </section>
  );
}
