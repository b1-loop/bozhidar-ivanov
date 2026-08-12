"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps & {
    children: ReactNode;
  };

export function TransitionLink({ href, children, onClick, ...rest }: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    if (typeof document.startViewTransition !== "function") return;
    e.preventDefault();
    document.startViewTransition(() => {
      router.push(typeof href === "string" ? href : href.pathname ?? "/");
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
