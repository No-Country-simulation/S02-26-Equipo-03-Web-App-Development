import SettingsLayout from "@/shared/components/Settings/SettingsLayout";
import IntegrationCardSkeleton from "@/shared/components/Settings/integrations/IntegrationCardSkeleton";

export default function SettingsLoading() {
  return (
    <SettingsLayout>
      <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(240px,240px))] justify-center gap-6 sm:justify-start">
        {Array.from({ length: 4 }).map((_, index) => (
          <IntegrationCardSkeleton key={index} />
        ))}
      </div>
    </SettingsLayout>
  );
}
