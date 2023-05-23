import { FileTree, DirectoryNode } from "@/components/file-tree";
import { Inter } from "next/font/google";
import { useState } from "react";
import { cloneDeep } from "lodash";
import { sampleData } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [treeState, setTreeState] = useState<DirectoryNode>(() => {
    const initialState = cloneDeep(sampleData);
    initialState.expanded = true;
    return initialState;
  });

  const [selected, setSelected] = useState<string[]>();

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <FileTree
        className="w-96 min-w-min border-2 border-solid border-gray-300 rounded p-4"
        treeState={treeState}
        setTreeState={setTreeState}
        onClick={(path) => setSelected(path)}
      />
      {selected && (
        <span>
          selected {"=>"} {selected?.join("＞")}
        </span>
      )}
    </main>
  );
}
