import { DirectoryNode, FileNode, TreeNode } from "@/components/file-tree";
import { Folder, File, Node } from "@/utils/types";

function dataToTreeNode(node: Folder): DirectoryNode;
function dataToTreeNode(node: File): FileNode;
function dataToTreeNode(node: Node): TreeNode;
function dataToTreeNode(node: Node): TreeNode {
  if (node.kind === "file") {
    return {
      kind: "file",
      name: node.name,
      meta: node.size,
    };
  }
  return {
    kind: "directory",
    name: node.name,
    expanded: false,
    children: node.children.map((child) => dataToTreeNode(child)),
  };
}

import { data } from "./data";
export const sampleData = dataToTreeNode(data);
