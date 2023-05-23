export type Node = File | Folder;

export type Folder = {
  kind: "directory";
  name: string;
  children: Array<Node>;
};

export type File = {
  kind: "file";
  name: string;
  size: string;
  modified: string;
};
