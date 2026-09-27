import "server-only";
import Image, { type ImageProps } from "next/image";
import manifest from "@/generated/image-manifest.json";
import { PreparedImage } from "@/components/PreparedImage";

type Entry = { hash: string; widths: number[] };
const images: Record<string, Entry> = manifest;

/** Keep the full source manifest on the server, sending only this image's variants. */
export default function OptimizedImage(props: ImageProps) {
  const prepared = typeof props.src === "string" ? images[props.src] : undefined;
  if (!prepared || props.loader || props.unoptimized) return <Image {...props} alt={props.alt} />;
  return <PreparedImage {...props} prepared={prepared} />;
}
