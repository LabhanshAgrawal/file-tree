import React, { useCallback, useState } from "react";
import { Directory } from "./directory";
import { DirectoryNode, TreeNode } from "./types";

export type TreeProps = {
  treeState: DirectoryNode;
  setTreeState: (state: DirectoryNode) => void;
  onClick?: (path: string[]) => void;
  className?: string;
};

export const FileTree = ({
  treeState,
  setTreeState,
  onClick,
  className,
}: TreeProps) => {
  const [selected, setSelected] = useState<{
    path: string[];
    node?: TreeNode;
  }>({ path: [] });

  const onNodeClick = useCallback(
    (path: string[]) => {
      onClick?.(path);
    },
    [onClick]
  );

  return (
    <div className={className}>
      <Directory
        data={treeState}
        setData={setTreeState}
        onClick={onNodeClick}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};
