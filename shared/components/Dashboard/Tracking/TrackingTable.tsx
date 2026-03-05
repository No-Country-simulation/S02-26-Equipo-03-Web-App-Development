"use client";

import { useState, useMemo } from "react";
import { Issue } from "@/shared/interfaces/issue-tracking.interface";
import { IssuesTable } from "./IssuesTable";
import { SearchToolbar } from "../../ui/search-toolbar";


interface Props {
  issues: Issue[]
}

export function TrackingTable({ issues }: Props) {
  const [search, setSearch] = useState("");

  const filteredIssues = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return issues;
    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(query) ||
        issue.platform.toLowerCase().includes(query) ||
        issue.severity.toLowerCase().includes(query)
    );
  }, [search]);

  // Resetear página al buscar
  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <SearchToolbar
          search={search}
          onSearchChange={handleSearch}
        />
        <IssuesTable issues={filteredIssues} />
      </div>
  );
}