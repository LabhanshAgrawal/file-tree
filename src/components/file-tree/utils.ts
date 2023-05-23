import React from "react";
import { TreeNode } from "./types";

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
