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

export type InteractionHandlers = {
  onClick?: (path: string[]) => void;
  onMove?: (
    sourcePath: string[],
    destinationDirPath: string[]
  ) => TreeNode | null;
  onCreate?: (parentPath: string[], node: TreeNode) => TreeNode | null;
};
