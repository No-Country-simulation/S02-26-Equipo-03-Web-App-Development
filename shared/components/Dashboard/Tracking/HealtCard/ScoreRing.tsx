"use client";

interface ScoreRingProps {
  score: number;
  variant?: "ok" | "warning" | "critical";
}

const variantColor: Record<string, string> = {
  ok: "#049140",
  warning: "#A67102",
  critical: "#D70000",
};

const variantTrack: Record<string, string> = {
  ok: "#EEFFF4",
  warning: "#FFFFE7",
  critical: "#FFF0F0",
};

const SIZE = 150;
const STROKE = 12;

export function ScoreRing({ score, variant = "warning" }: ScoreRingProps) {
  const color = variantColor[variant];
  const trackColor = variantTrack[variant];

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * r;

  // Gap of 60° centered at the bottom → arc = 300°
  const ARC_DEG = 360;
  const arcLength = (ARC_DEG / 360) * circumference;
  const gapLength = circumference - arcLength;

  // Track: full 300° arc, gap at bottom
  // strokeDasharray = [arcLength, gapLength]
  // Rotate so gap sits at bottom: gap center = 270° (SVG bottom).
  // Arc starts at 270° + 30° = 300° from 3-o'clock = rotate(210°)
  const trackDash = `${arcLength} ${gapLength}`;
  const rotateOffset = 270; // degrees

  // Progress: score% of the 300° arc
  const progressArc = (score / 100) * arcLength;
  // dashoffset trick: start from 0, show progressArc, hide the rest
  // dasharray = [progressArc, rest of circumference]
  const progressDash = `${progressArc} ${circumference - progressArc}`;

  return (
    <div
      style={{ width: SIZE, height: SIZE, position: "relative", flexShrink: 0 }}
      className="flex items-center justify-center"
    >
      <svg width={SIZE} height={SIZE} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Track arc: 300° */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE}
          strokeDasharray={trackDash}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rotateOffset} ${cx} ${cy})`}
        />
        {/* Progress arc: score% of 300° */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={progressDash}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rotateOffset} ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>

      {/* Center text */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl leading-none font-bold text-gray-900">{score}</span>
        <span className="mt-1 text-xs font-medium tracking-tight text-[#475569]">Health Score</span>
      </div>
    </div>
  );
}
