import Image from "next/image";

type GardenAdsLogoProps = {
  variant?: "white" | "black";
  width?: number;
  height?: number;
};

export function GardenAdsLogo({
  variant = "black",
  width = 300,
  height = 150,
}: GardenAdsLogoProps) {
  return (
    <Image
      src={variant === "white" ? "/Logo_white.svg" : "/Logo_black.svg"}
      alt="GardenAds Logo"
      width={width}
      height={height}
      className="mx-auto"
    />
  );
}
