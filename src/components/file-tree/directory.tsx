import React, { useCallback, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  VscChevronRight,
  VscChevronDown,
  VscNewFile,
  VscNewFolder,
} from "react-icons/vsc";
import { DirectoryNode, TreeNode } from "./types";
import { isEqual, sortBy } from "lodash";

import { File } from "./file";
import { stopPropagation } from "./utils";
import { ActionButton } from "./action-button";
import { Node } from "./node";
import { NewItemForm, NewItemFormRef } from "./new-item-form";
import { DropZone } from "./drop-zone";

export type DirectoryProps = {
  data: DirectoryNode;
  setData: (state: DirectoryNode) => void;
  selected: { path: string[]; node?: TreeNode };
  setSelected: (selected: { path: string[]; node?: TreeNode }) => void;
  parentPath?: string[];
  onClick: (path: string[]) => void;
  onMove: (destinationPath: string[]) => void;
  onCreate: (parentPath: string[], node: TreeNode) => void;
  updateDragImage: (e: React.DragEvent) => void;
  actions?: React.ReactNode;
  className?: string;
};

export const Directory = ({
  data,
  setData,
  selected,
  setSelected,
  parentPath,
  onClick,
  onMove,
  onCreate,
  updateDragImage,
  actions,
  className,
}: DirectoryProps) => {
  const currentPath = useMemo(
    () => [...(parentPath || []), data.name],
    [data.name, parentPath]
  );

  const isSelected = useMemo(
    () => isEqual(selected.path, currentPath),
    [currentPath, selected.path]
  );

  const selectThis = useCallback(() => {
    setSelected({ path: currentPath, node: data });
  }, [currentPath, data, setSelected]);

  const toggleExpand = useCallback(
    (expanded?: boolean) => {
      setData({ ...data, expanded: expanded ?? !data.expanded });
    },
    [data, setData]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      stopPropagation(e);
      selectThis();
      onClick(currentPath);
      updateDragImage(e);
    },
    [currentPath, onClick, selectThis, updateDragImage]
  );

  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(() => {
    onMove(currentPath);
  }, [currentPath, onMove]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      stopPropagation(e);
      selectThis();
      toggleExpand();
      onClick(currentPath);
    },
    [currentPath, onClick, selectThis, toggleExpand]
  );

  const newItemFormRef = useRef<NewItemFormRef>(null);

  const handleNewItemFormClick = useCallback(
    (e: React.MouseEvent, kind: TreeNode["kind"]) => {
      stopPropagation(e);
      toggleExpand(true);
      newItemFormRef.current?.open(kind);
    },
    [newItemFormRef, toggleExpand]
  );

  return (
    <DropZone
      className={clsx({ "bg-gray-300": dragOver }, className)}
      onDragOver={setDragOver}
      onDrop={handleDrop}
    >
      <Node
        data={data}
        isSelected={isSelected}
        icon={data.expanded ? <VscChevronDown /> : <VscChevronRight />}
        actions={
          <>
            <ActionButton
              onClick={(e) => handleNewItemFormClick(e, "file")}
              title="New File"
            >
              <VscNewFile />
            </ActionButton>

            <ActionButton
              onClick={(e) => handleNewItemFormClick(e, "directory")}
              title="New Folder"
            >
              <VscNewFolder />
            </ActionButton>

            {actions}
          </>
        }
        onClick={handleClick}
        onDragStart={handleDragStart}
      />

      <div
        className={clsx(data.expanded ? "flex" : "hidden", "flex-row")}
        onClick={stopPropagation}
      >
        <div className="flex justify-center w-7">
          <div className="border-x border-solid h-full" />
        </div>
        <div className="flex-1">
          <NewItemForm
            currentPath={currentPath}
            onCreate={onCreate}
            ref={newItemFormRef}
          />

          {sortBy(sortBy(data.children, "name"), "kind").map((item) =>
            item.kind === "directory" ? (
              <Directory
                key={item.name}
                data={item}
                parentPath={currentPath}
                onClick={onClick}
                onMove={onMove}
                onCreate={onCreate}
                setData={(state) => {
                  setData({
                    ...data,
                    children: data.children.map((child) =>
                      child.name === item.name ? state : child
                    ),
                  });
                }}
                selected={selected}
                setSelected={setSelected}
                updateDragImage={updateDragImage}
                className={className}
              />
            ) : (
              <File
                key={item.name}
                data={item}
                parentPath={currentPath}
                selected={selected}
                setSelected={setSelected}
                onClick={onClick}
                updateDragImage={updateDragImage}
              />
            )
          )}
        </div>
      </div>
    </DropZone>
  );
};
