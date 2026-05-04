"use client";

import { useState } from "react";
import { EditButton } from "./ActionButtons";

export function EditableTitle({ value }: { value: string }) {
  const [title, setTitle] = useState(value);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-ui text-xs font-semibold tracking-wider text-text-secondary">
          TÍTULO
        </span>
        <div className="flex items-center gap-2">
          <EditButton />
        </div>
      </div>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="w-full rounded-[4px] border border-admin-ink bg-white px-3 py-2 font-ui text-sm font-medium text-admin-ink outline-none"
      />
    </div>
  );
}
