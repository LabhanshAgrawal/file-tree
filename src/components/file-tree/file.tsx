import React, { useCallback, useMemo } from "react";
import { VscFile } from "react-icons/vsc";
import { FileNode, TreeNode } from "./types";
import { isEqual } from "lodash";
import { stopPropagation } from "./utils";
import { Node } from "./node";

export type FileProps = {
  data: FileNode;
  parentPath?: string[];
  selected: { path: string[]; node?: TreeNode };
  setSelected: (selected: { path: string[]; node?: TreeNode }) => void;
  onClick: (path: string[]) => void;
  updateDragImage: (e: React.DragEvent) => void;
  actions?: React.ReactNode;
  className?: string;
};

export const File = ({
  data,
  parentPath,
  selected,
  setSelected,
  onClick,
  updateDragImage,
  actions,
  className,
}: FileProps) => {
  const currentPath = useMemo(
    () => [...(parentPath || []), data.name],
    [data.name, parentPath]
  );

  const isSelected = useMemo(
    () => isEqual(selected.path, currentPath),
    [selected.path, currentPath]
  );

  const selectThis = useCallback(() => {
    setSelected({ path: currentPath, node: data });
  }, [currentPath, data, setSelected]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      stopPropagation(e);
      selectThis();
      onClick(currentPath);
    },
    [currentPath, onClick, selectThis]
  );

  const handleDragStart = (e: React.DragEvent) => {
    stopPropagation(e);
    selectThis();
    onClick(currentPath);
    updateDragImage(e);
  };

  return (
    <Node
      data={data}
      isSelected={isSelected}
      icon={<VscFile />}
      actions={actions}
      onClick={handleClick}
      onDragStart={handleDragStart}
      className={className}
    />
  );
};
