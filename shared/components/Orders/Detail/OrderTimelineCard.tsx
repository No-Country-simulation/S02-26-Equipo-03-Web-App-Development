import { TimelineEvent } from "../../../types/order-detail.types";

interface OrderTimelineCardProps {
  timeline: TimelineEvent[];
}

export function OrderTimelineCard({ timeline }: OrderTimelineCardProps) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-6">
      <p className="mb-4 text-xs font-semibold tracking-widest text-gray-400 uppercase">
        Línea de Tiempo
      </p>

      <div className="flex flex-col gap-4">
        {timeline.map((event, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full border-2 ${
                  event.isHighlighted
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-gray-300 bg-white"
                }`}
              />
              {i < timeline.length - 1 && <span className="mt-1 h-8 w-px bg-gray-200" />}
            </div>
            <div className="-mt-0.5">
              <p
                className={`text-xs font-semibold tracking-wide uppercase ${
                  event.isHighlighted ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {event.timestamp}
              </p>
              <p className="text-sm text-gray-800">{event.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
