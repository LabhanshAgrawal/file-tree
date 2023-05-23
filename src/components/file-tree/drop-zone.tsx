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
