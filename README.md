This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

You can view the live demo [here](https://file-tree-tau.vercel.app/).

## About

This is a simple file tree component built using React and Typescript. The component allows for the following operations:

- Display a file tree
- Expand/Collapse a directory
- Expand/Collapse all directories (from the root node)
- Create a file/directory inside any directory
- Move a file/directory to any directory by dragging and dropping

> Note: The demo also includes a `Load Local Folder Data` button that allows you to select a directory from your local machine (view only, move/create operations will not impact your local machine data) (might be a bit slow for huge or highly nested folders).

The code for the File Tree component lives in the [src/components/file-tree](./src/components/file-tree/) directory. The component is built using React and Typescript. The component is used in the [src/pages/index.tsx](./src/pages/index.tsx) file.

The `FileTree` component takes in the following props:

```ts
type TreeProps = {
  treeState: DirectoryNode; // The root node of the tree
  setTreeState: (state: DirectoryNode) => void; // A function to update the tree state
  onClick?: (path: string[]) => void; // A function to handle click events on the tree nodes
  onMove?: (
    sourcePath: string[],
    destinationDirPath: string[]
  ) => TreeNode | null; // A function to handle move operations
  onCreate?: (parentPath: string[], node: TreeNode) => TreeNode | null; // A function to handle create operations
  className?: string; // A class name to be applied to the root element of the tree
};
```

### Some assumptions and design decisions

- The root node is always a directory instead of an array of nodes.
- Expand all and collapse all buttons are only added to the root node.
- The `onMove` and `onCreate` functions are passed to the `FileTree` component from the parent component. This is to allow the parent component to handle the move and create operations in a way that makes sense for the parent component. For example, the parent component might want to make an API call to update the data on some server.

### Some improvements that can be made

- Node actions like create/expand all/collapse all may be added to the `TreeNode` type to allow for different actions for each file or directory.
- Customizable styling for different components of the tree.
- Icons can be added to the `FileNode` type to allow for different icons for different files.


## Getting Started

Install dependencies

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can edit the data used in the app by editing the [src/utils/data.ts](./src/utils/data.ts) file. Or use the `Load Local Folder Data` button to select a directory from your local machine.