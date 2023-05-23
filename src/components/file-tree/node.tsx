import React from "react";
import clsx from "clsx";
import { TreeNode } from "./types";

export type NodeProps = {
  data: TreeNode;
  isSelected: boolean;
  icon: React.ReactNode;
  actions?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
};

export const Node = ({
  data: { name, meta },
  isSelected,
  icon,
  actions,
  onClick,
  className,
}: NodeProps) => (
  <div
    onClick={onClick}
    className={clsx(
      "cursor-pointer leading-4 select-none",
      "flex h-7 items-center justify-between hover:bg-gray-300 group",
      { "bg-gray-400": isSelected },
      className
    )}
  >
    <div className="text-sm whitespace-nowrap flex items-center flex-1">
      <div className="h-7 w-7 p-1 flex items-center justify-center">{icon}</div>

      <div className="flex-1 transition-opacity hover:opacity-70">
        <span>{name}</span>
      </div>
    </div>

    <div className="h-full flex items-center p-1 space-x-1 whitespace-nowrap">
      {meta && <span className="text-xs">{meta}</span>}
      {actions}
    </div>
  </div>
);
