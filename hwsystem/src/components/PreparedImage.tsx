"use client";

import Image, { type ImageProps, type ImageLoaderProps } from "next/image";

/** Next still owns responsive sizing, intrinsic dimensions, preload and lazy loading. */
export function PreparedImage({ prepared, ...props }: ImageProps & {
  prepared: { hash: string; widths: number[] };
}) {
  function loader({ width }: ImageLoaderProps): string {
    const size = prepared.widths.find(candidate => candidate >= width) ?? prepared.widths[prepared.widths.length - 1];
    return `/optimized/${prepared.hash}-${size}.webp`;
  }
  return <Image {...props} alt={props.alt} loader={loader} />;
}
