import React, { useCallback, useMemo } from "react";
import clsx from "clsx";
import { VscChevronRight, VscChevronDown } from "react-icons/vsc";
import { DirectoryNode, TreeNode } from "./types";
import { isEqual, sortBy } from "lodash";

import { File } from "./file";
import { stopPropagation } from "./utils";
import { Node } from "./node";

export type DirectoryProps = {
  data: DirectoryNode;
  setData: (state: DirectoryNode) => void;
  selected: { path: string[]; node?: TreeNode };
  setSelected: (selected: { path: string[]; node?: TreeNode }) => void;
  parentPath?: string[];
  onClick: (path: string[]) => void;
  className?: string;
};

export const Directory = ({
  data,
  setData,
  selected,
  setSelected,
  parentPath,
  onClick,
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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      stopPropagation(e);
      selectThis();
      toggleExpand();
      onClick(currentPath);
    },
    [currentPath, onClick, selectThis, toggleExpand]
  );

  return (
    <div className={className}>
      <Node
        data={data}
        isSelected={isSelected}
        icon={data.expanded ? <VscChevronDown /> : <VscChevronRight />}
        onClick={handleClick}
      />

      <div
        className={clsx(data.expanded ? "flex" : "hidden", "flex-row")}
        onClick={stopPropagation}
      >
        <div className="flex justify-center w-7">
          <div className="border-x border-solid h-full" />
        </div>
        <div className="flex-1">
          {sortBy(sortBy(data.children, "name"), "kind").map((item) =>
            item.kind === "directory" ? (
              <Directory
                key={item.name}
                data={item}
                parentPath={currentPath}
                onClick={onClick}
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
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
