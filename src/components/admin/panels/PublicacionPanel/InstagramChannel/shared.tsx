"use client";

import { useState } from "react";
import { CopyButton, EditButton } from "../shared/ActionButtons";

export function InstagramEditablePill({ value }: { value: string }) {
  const [pillValue, setPillValue] = useState(value);

  return (
    <div className="inline-flex items-center gap-3">
      <input
        type="text"
        value={pillValue}
        onChange={(event) => setPillValue(event.target.value)}
        className="h-[28px] rounded-[3.5px] border border-admin-ink bg-white px-2 font-ui text-xs font-semibold text-admin-ink outline-none"
        style={{ width: `${pillValue.length + 2}ch` }}
      />
      <EditButton />
      <CopyButton />
    </div>
  );
}

export function InstagramBulletRow({ bullet }: { bullet: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="inline-flex rounded-[3.5px] border border-admin-ink bg-white px-2 py-1">
        <span className="font-ui text-sm font-medium text-admin-ink">
          ■ {bullet}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        <EditButton />
        <CopyButton />
      </div>
    </div>
  );
}

export function InstagramBulletRows({ bullets }: { bullets: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      {bullets.map((bullet) => (
        <InstagramBulletRow key={bullet} bullet={bullet} />
      ))}
    </div>
  );
}

export function InstagramVoteRow({
  label,
  borderColor,
  pxValue,
  percentValue,
}: {
  label: string;
  borderColor: string;
  pxValue: string;
  percentValue: string;
}) {
  const [widthValue, setWidthValue] = useState(pxValue);
  const [voteValue, setVoteValue] = useState(percentValue);

  return (
    <div className="flex items-center gap-2">
      <div
        className="inline-flex h-[28px] items-center rounded-[3.5px] px-2"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <span
          className="font-ui text-sm font-medium"
          style={{ color: borderColor }}
        >
          {label}
        </span>
      </div>
      <input
        type="text"
        value={widthValue}
        onChange={(event) => setWidthValue(event.target.value)}
        className="h-[28px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink outline-none"
        style={{ width: `${widthValue.length + 2}ch` }}
      />
      <CopyButton />
      <input
        type="text"
        value={voteValue}
        onChange={(event) => setVoteValue(event.target.value)}
        className="h-[28px] rounded-[4px] border border-admin-ink bg-white px-2 font-ui text-xs font-medium text-admin-ink outline-none"
        style={{ width: `${voteValue.length + 3}ch` }}
      />
      <CopyButton />
    </div>
  );
}
