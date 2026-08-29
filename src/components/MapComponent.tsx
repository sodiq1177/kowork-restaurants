"use client";


interface MapComponentProps {
  lat: number;
  lng: number;
  title?: string;
}

export default function MapComponent({
  lat,
  lng,
  title = "Restaurant Location",
}: MapComponentProps) {
  return (
    <iframe
      title={title}
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
      className="w-full rounded-lg border-0"
      style={{ height: "400px" }}
      loading="lazy"
    />
  );
}

