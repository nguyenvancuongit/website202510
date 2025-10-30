"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export interface TruncateTypoProps {
  text: string;
  /** maximum number of characters to show when collapsed */
  maxChars?: number;
  /** optional className for the text container */
  className?: string;
  /** labels */
  viewMoreLabel?: string;
  viewLessLabel?: string;
  /** whether to show the view more button even if text is short */
  forceButton?: boolean;
}

/**
 * TruncateTypo
 * - shows up to `maxChars` characters and appends `...` with a "View more" button.
 * - clicking the button expands to full text and toggles to "View less".
 * - lightweight, accessible and uses shadcn `Button` for consistent styling.
 *
 * Usage:
 * <TruncateTypo text={longText} maxChars={100} />
 */

export default function TruncateTypo({
  text,
  maxChars = 100,
  className = "",
  viewMoreLabel = "View more",
  viewLessLabel = "View less",
  forceButton = false,
}: TruncateTypoProps) {
  const [expanded, setExpanded] = useState(false);

  const needsTruncate = text.length > maxChars;

  const truncated = useMemo(() => {
    if (!needsTruncate) return text;
    return text.slice(0, maxChars) + "...";
  }, [needsTruncate, text, maxChars]);

  // If the text is short and forceButton is false, we won't render the button.
  const showButton = needsTruncate || forceButton;

  return (
    <div className={`truncate-typo ${className}`}>
      <p className="leading-relaxed text-sm break-words">
        {expanded ? text : truncated}
      </p>

      {showButton && (
        <div className="mt-2">
          <Button
            size="sm"
            variant="link"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="truncate-typo-text"
          >
            {expanded ? viewLessLabel : viewMoreLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
