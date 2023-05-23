import React from "react";
import { DirectoryNode, TreeNode } from "./types";

export const stopPropagation = (event: React.MouseEvent) => {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
};

export const findNode = (
  node: TreeNode,
  path: string[]
): TreeNode | undefined => {
  const [name, ...rest] = path;

  if (node.name !== name) return;

  if (rest.length === 0) return node;

  if (node.kind === "file") return;

  return node.children.flatMap((child) => {
    const found = findNode(child, rest);
    return found ? [found] : [];
  })[0];
};

export const extractNode = (
  node: DirectoryNode,
  path: string[]
): TreeNode | undefined => {
  const parentPath = [...path];
  const name = parentPath.pop();
  const parentNode = findNode(node, parentPath);

  if (parentNode?.kind === "directory") {
    const index = parentNode.children.findIndex((child) => child.name === name);

    if (index === -1) {
      return;
    }

    return parentNode.children.splice(index, 1)[0];
  }
};
