import { type ReactNode } from "react";

type PanelLayoutProps = {
  header?: ReactNode;
  content?: ReactNode;
  legacy?: ReactNode;
  className?: string;
};

export function PanelLayout({
  header,
  content,
  legacy,
  className = "",
}: PanelLayoutProps) {
  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      {header && <div className="shrink-0">{header}</div>}
      {content && <div className="flex-1 min-h-0">{content}</div>}
      {legacy && <div className="shrink-0">{legacy}</div>}
    </div>
  );
}
