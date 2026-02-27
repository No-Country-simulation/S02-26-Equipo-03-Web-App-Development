import Image from "next/image";

export function GardenAdsLogo({ variant }: { variant?: "white" | "black" }) {
  return (
    <Image
      src={variant === "white" ? "/Logo_white.svg" : "/Logo_black.svg"}
      alt="GardenAds Logo"
      width={300}
      height={150}
      className="mx-auto"
    />
  );
}
