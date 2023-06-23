import React, { useCallback, useContext, useMemo } from "react";
import { VscFile } from "react-icons/vsc";
import { FileNode, TreeNode } from "./types";
import { isEqual } from "lodash";
import { stopPropagation } from "./utils";
import { Node } from "./node";
import { useFileTreeContext } from "./context";

export type FileProps = {
  data: FileNode;
  parentPath?: string[];
  actions?: React.ReactNode;
  className?: string;
};

export const File = ({ data, parentPath, actions, className }: FileProps) => {
  const { updateDragImage, selected, setSelected, onClick } =
    useFileTreeContext();

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
