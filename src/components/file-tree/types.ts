export type DirectoryNode = {
  kind: "directory";
  name: string;
  meta?: string;
  expanded: boolean;
  children: Array<TreeNode>;
};

export type FileNode = {
  kind: "file";
  name: string;
  meta?: string;
};

export type TreeNode = DirectoryNode | FileNode;
