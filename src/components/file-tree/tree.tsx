import React, { useCallback, useState } from "react";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";
import { Directory } from "./directory";
import { DirectoryNode, TreeNode } from "./types";
import { stopPropagation } from "./utils";
import { ActionButton } from "./action-button";

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

  const expandAllHandler = useCallback(
    (e: React.MouseEvent, expanded: boolean) => {
      stopPropagation(e);

      function setExpandedAll(node: TreeNode): TreeNode {
        if (node.kind === "directory") {
          return {
            ...node,
            expanded,
            children: node.children.map((child) => setExpandedAll(child)),
          };
        }
        return node;
      }

      setTreeState({
        ...treeState,
        children: treeState.children.map((child) => setExpandedAll(child)),
      });
    },
    [setTreeState, treeState]
  );

  return (
    <div className={className}>
      <Directory
        data={treeState}
        setData={setTreeState}
        onClick={onNodeClick}
        selected={selected}
        setSelected={setSelected}
        actions={
          <>
            <ActionButton
              onClick={(e) => expandAllHandler(e, false)}
              title="Collapse All"
            >
              <VscCollapseAll />
            </ActionButton>

            <ActionButton
              onClick={(e) => expandAllHandler(e, true)}
              title="Expand All"
            >
              <VscExpandAll />
            </ActionButton>
          </>
        }
      />
    </div>
  );
};
