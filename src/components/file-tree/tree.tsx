import React, { useCallback, useState } from "react";
import {
  VscCollapseAll,
  VscExpandAll,
  VscFile,
  VscFolder,
} from "react-icons/vsc";
import { Directory } from "./directory";
import { DirectoryNode, TreeNode } from "./types";
import { stopPropagation } from "./utils";
import { ActionButton } from "./action-button";
import { isEqual } from "lodash";

export type TreeProps = {
  treeState: DirectoryNode;
  setTreeState: (state: DirectoryNode) => void;
  onClick?: (path: string[]) => void;
  onMove?: (
    sourcePath: string[],
    destinationDirPath: string[]
  ) => TreeNode | null;
  onCreate?: (parentPath: string[], node: TreeNode) => TreeNode | null;
  className?: string;
};

export const FileTree = ({
  treeState,
  setTreeState,
  onClick,
  onMove,
  onCreate,
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

  const onNodeDrop = useCallback(
    (destinationPath: string[]) => {
      if (
        isEqual(selected.path, destinationPath.slice(0, selected.path.length))
      ) {
        return;
      }

      const moved = onMove?.(selected.path, destinationPath);
      if (moved) {
        setSelected({ path: [...destinationPath, moved.name], node: moved });
        onNodeClick([...destinationPath, moved.name]);
      }
    },
    [onNodeClick, onMove, selected.path]
  );

  const onNodeCreate = useCallback(
    (parentPath: string[], node: TreeNode) => {
      const created = onCreate?.(parentPath, node);
      if (created) {
        setSelected({ path: [...parentPath, created.name], node: created });
        onNodeClick([...parentPath, created.name]);
      }
    },
    [onNodeClick, onCreate]
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

  /**
   * Drag preview used when dragging a file or directory.
   */
  const dragImageRef = React.useRef<HTMLDivElement>(null);

  const updateDragImage = useCallback(
    (e: React.DragEvent) => {
      if (dragImageRef.current) {
        e.dataTransfer.setDragImage(
          dragImageRef.current,
          0,
          dragImageRef.current.offsetHeight / 2
        );
      }
    },
    [dragImageRef]
  );

  return (
    <div className={className}>
      <div
        ref={dragImageRef}
        className="rounded-full text-sm whitespace-nowrap pl-2 pr-4 bg-gray-300 flex items-center max-w-min absolute -top-10"
      >
        <div className="h-7 w-7 flex items-center justify-center">
          {selected.node?.kind === "directory" ? <VscFolder /> : <VscFile />}
        </div>
        <span>{selected.path[selected.path.length - 1]}</span>
      </div>

      <Directory
        data={treeState}
        setData={setTreeState}
        onClick={onNodeClick}
        onMove={onNodeDrop}
        onCreate={onNodeCreate}
        selected={selected}
        setSelected={setSelected}
        updateDragImage={updateDragImage}
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
