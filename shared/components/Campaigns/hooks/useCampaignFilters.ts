import { useMemo, useState } from "react";
import { Campaign } from "../types/campaign.types";

const PAGE_SIZE = 7;

export function useCampaignFilters(campaigns: Campaign[]) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"all" | "low">("all");

  const filteredCampaigns = useMemo(() => {
    if (!search) return campaigns;

    const query = search.toLowerCase();

    return campaigns.filter(
      (c) => c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
    );
  }, [search, campaigns]);

  const paginatedCampaigns = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCampaigns.slice(start, start + PAGE_SIZE);
  }, [filteredCampaigns, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    search,
    page,
    tab,
    total: filteredCampaigns.length,
    pageSize: PAGE_SIZE,
    campaigns: paginatedCampaigns,
    setPage,
    setTab,
    handleSearch,
  };
}
