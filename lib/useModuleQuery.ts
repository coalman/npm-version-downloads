import { useState, useEffect } from "react";
import { type ModuleStats as ModuleStatsData } from "pages/api/module/[module]/stats";

export function useModuleQuery(moduleName: string) {
  const [queryState, setQueryState] = useState<
    | { state: "pending" }
    | { state: "completed"; data: ModuleStatsData }
    | { state: "error"; reason: string }
  >({ state: "pending" });

  useEffect(() => {
    setQueryState({ state: "pending" });

    const abortController = new AbortController();
    fetchModuleStats(moduleName, abortController.signal).then(
      (data) => {
        if (data !== undefined && !abortController.signal.aborted) {
          setQueryState({ state: "completed", data });
        }
      },
      (reason: unknown) => {
        setQueryState({ state: "error", reason: String(reason) });
      }
    );

    return () => {
      abortController.abort();
    };
  }, [moduleName]);

  return queryState;
}

export async function fetchModuleStats(
  moduleName: string,
  signal?: AbortSignal
) {
  let response: Response;
  try {
    response = await fetch(`/api/module/${moduleName}/stats`, { signal });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") {
      return undefined;
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(`(${response.status}) ${response.statusText}`);
  }

  return response.json();
}
