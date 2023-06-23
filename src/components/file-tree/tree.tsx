import React, { useCallback } from "react";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";
import { Directory } from "./directory";
import { DirectoryNode, InteractionHandlers, TreeNode } from "./types";
import { stopPropagation } from "./utils";
import { ActionButton } from "./action-button";
import { FileTreeProvider } from "./context";

export type TreeProps = {
  treeState: DirectoryNode;
  setTreeState: (state: DirectoryNode) => void;
  className?: string;
} & InteractionHandlers;

export const FileTree = ({
  treeState,
  setTreeState,
  onClick,
  onMove,
  onCreate,
  className,
}: TreeProps) => {
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
    <FileTreeProvider value={{ onClick, onCreate, onMove }}>
      <div className={className}>
        <Directory
          data={treeState}
          setData={setTreeState}
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
    </FileTreeProvider>
  );
};
