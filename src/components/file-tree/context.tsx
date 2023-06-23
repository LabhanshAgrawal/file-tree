import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { InteractionHandlers, TreeNode } from "./types";
import { isEqual } from "lodash";
import React from "react";
import { VscFile, VscFolder } from "react-icons/vsc";

const FileTreeContext = createContext<{
  selected: { path: string[]; node?: TreeNode };
  setSelected: (selected: { path: string[]; node?: TreeNode }) => void;
  updateDragImage: (e: React.DragEvent) => void;
  onClick: (path: string[]) => void;
  onMove: (destinationPath: string[]) => void;
  onCreate: (parentPath: string[], node: TreeNode) => void;
}>({
  selected: { path: [], node: undefined },
  setSelected: () => {},
  updateDragImage: () => {},
  onClick: () => {},
  onMove: () => {},
  onCreate: () => {},
});

export const useFileTreeContext = () => useContext(FileTreeContext);

export const FileTreeProvider = ({
  children,
  value: { onClick, onCreate, onMove },
}: PropsWithChildren<{ value: InteractionHandlers }>) => {
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
    [selected.path, onMove, setSelected, onNodeClick]
  );

  const onNodeCreate = useCallback(
    (parentPath: string[], node: TreeNode) => {
      const created = onCreate?.(parentPath, node);
      if (created) {
        setSelected({ path: [...parentPath, created.name], node: created });
        onNodeClick([...parentPath, created.name]);
      }
    },
    [onCreate, setSelected, onNodeClick]
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
    <FileTreeContext.Provider
      value={{
        selected,
        setSelected,
        onClick: onNodeClick,
        onMove: onNodeDrop,
        onCreate: onNodeCreate,
        updateDragImage: updateDragImage,
      }}
    >
      <div
        ref={dragImageRef}
        className="rounded-full text-sm whitespace-nowrap pl-2 pr-4 bg-gray-300 flex items-center max-w-min absolute -top-10"
      >
        <div className="h-7 w-7 flex items-center justify-center">
          {selected.node?.kind === "directory" ? <VscFolder /> : <VscFile />}
        </div>
        <span>{selected.path[selected.path.length - 1]}</span>
      </div>
      {children}
    </FileTreeContext.Provider>
  );
};
