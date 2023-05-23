import React, { useCallback, useRef } from "react";
import { stopPropagation } from "./utils";

export type DropZoneProps = {
  className: string | undefined;
  onDragOver: (dragOver: boolean) => void;
  onDrop: () => void;
};

export const DropZone = ({
  className,
  onDragOver,
  onDrop,
  children,
}: React.PropsWithChildren<DropZoneProps>) => {
  /**
   * We keep a counter to determine if the mouse is within the parent element
   * or its children. This approach is more reliable than using dragenter and
   * dragleave events directly, which can be triggered by child elements and
   * cause flickering, or the dragover event, which fires continuously.
   */
  const dragCounterRef = useRef(0);
  const setDragCounter = useCallback(
    (value: number) => {
      dragCounterRef.current = value;
      onDragOver(value > 0);
    },
    [onDragOver]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      stopPropagation(e);
      setDragCounter(dragCounterRef.current + 1);
    },
    [setDragCounter]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      stopPropagation(e);
      setDragCounter(dragCounterRef.current - 1);
    },
    [setDragCounter]
  );

  const handleDragEnd = useCallback(() => {
    setDragCounter(0);
  }, [setDragCounter]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      setDragCounter(0);
      stopPropagation(e);
      e.preventDefault();
      onDrop();
    },
    [onDrop, setDragCounter]
  );

  return (
    <div
      className={className}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};
