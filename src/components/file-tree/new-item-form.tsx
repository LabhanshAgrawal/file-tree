import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { VscChevronRight, VscFile } from "react-icons/vsc";
import { TreeNode } from "./types";

export type NewItemFormProps = {
  currentPath: string[];
  onCreate: (parentPath: string[], node: TreeNode) => void;
};

export type NewItemFormRef = {
  open: (kind: TreeNode["kind"]) => void;
};

const NewItemForm = forwardRef<NewItemFormRef, NewItemFormProps>(
  ({ currentPath, onCreate }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showNewItemInput, setShowNewItemInput] = useState(false);
    const [newItem, setNewItem] = useState<TreeNode>({
      name: "",
      kind: "file",
    });

    useImperativeHandle<NewItemFormRef, NewItemFormRef>(
      ref,
      () => ({
        open: (kind: TreeNode["kind"]) => {
          setShowNewItemInput(true);
          setNewItem(
            kind === "file"
              ? { name: "", kind }
              : { name: "", kind, children: [], expanded: false }
          );
          requestAnimationFrame(() => inputRef.current?.focus());
        },
      }),
      [setShowNewItemInput, setNewItem, inputRef]
    );

    const closeInput = useCallback(() => {
      setShowNewItemInput(false);
      setNewItem({ name: "", kind: "file" });
    }, [setNewItem, setShowNewItemInput]);

    const handleNewItemSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.name !== "") {
          onCreate(currentPath, newItem);
          closeInput();
        }
      },
      [closeInput, currentPath, newItem, onCreate]
    );

    const handleNewItemInputBlur = useCallback(() => {
      if (newItem.name !== "") {
        onCreate(currentPath, newItem);
      }
      closeInput();
    }, [closeInput, currentPath, newItem, onCreate]);

    return (
      <form
        onSubmit={handleNewItemSubmit}
        className={clsx(
          showNewItemInput ? "flex" : "hidden",
          "text-sm h-7 items-center justify-between"
        )}
      >
        <div className="h-7 w-7 p-1 flex items-center justify-center">
          {newItem.kind === "file" ? <VscFile /> : <VscChevronRight />}
        </div>

        <input
          type="text"
          ref={inputRef}
          value={newItem?.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="flex-1 h-full px-2 text-sm border border-gray-300 rounded"
          onBlur={handleNewItemInputBlur}
          onKeyDown={(e) => e.key === "Escape" && closeInput()}
        />
      </form>
    );
  }
);

NewItemForm.displayName = "NewItem";

export { NewItemForm };
