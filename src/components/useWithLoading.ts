import { useCallback, useState } from "react";

interface Result<Args> {
  load: (args: Args) => void;
  isLoading: boolean;
}

export function useWithLoading<Args>(
  fn: (args: Args) => Promise<void>
): Result<Args> {
  const [isLoading, setLoading] = useState(false);

  const createFn = isLoading
    ? async () => {
        throw new Error("Multiple mutations happening at the same time!");
      }
    : async (args: Args) => {
        setLoading(true);
        await fn(args);
        setLoading(false);
      };

  return {
    isLoading: isLoading,
    load: useCallback(createFn, [fn, isLoading]),
  };
}
