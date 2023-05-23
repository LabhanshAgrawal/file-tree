import React from "react";
import { DirectoryNode, TreeNode } from "./types";
import prettyBytes from "pretty-bytes";

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

export const getDirNodeFromHandle = async (dir: FileSystemDirectoryHandle) => {
  const result: DirectoryNode = {
    kind: "directory",
    name: dir.name,
    children: [],
    expanded: false,
  };
  for await (const entry of (dir as any).values() as AsyncIterableIterator<
    FileSystemHandle | FileSystemDirectoryHandle
  >) {
    if (entry.kind === "file") {
      result.children.push({
        kind: "file",
        name: entry.name,
        meta: prettyBytes(((await (entry as any).getFile()) as File).size, {
          maximumFractionDigits: 0,
        }),
      });
    } else if (entry.kind === "directory") {
      result.children.push(
        await getDirNodeFromHandle(entry as FileSystemDirectoryHandle)
      );
    }
  }

  return result;
};
