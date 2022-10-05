import { useRouter } from "next/router";
import { memo, useRef, useCallback } from "react";
import { encodeModuleName } from "lib/moduleName";

function ModuleSearch(props: { autoFocus?: boolean }) {
  const refInput = useRef<HTMLInputElement | null>(null);
  const setInput = useCallback(
    (element: HTMLInputElement) => {
      refInput.current = element;
      // NOTE: autoFocus prop on the input doesn't seem to work on FF
      if (props.autoFocus) {
        element?.focus();
      }
    },
    [props.autoFocus]
  );

  const router = useRouter();
  const navigateToModule = () => {
    if (refInput.current && refInput.current.value !== "") {
      const moduleName = encodeModuleName(refInput.current.value);
      router.push({
        pathname: "/module/[moduleName]",
        query: { moduleName },
      });
    }
  };

  return (
    <form role="search" className="flex gap-2">
      <input
        ref={setInput}
        className="text-center bg-slate-900 text-slate-50 border-slate-400 border-solid border rounded-sm placeholder:italic placeholder:text-slate-400"
        type="text"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Find an npm package."
        placeholder="Find an npm package"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            navigateToModule();
            event.preventDefault();
          }
        }}
      />
      <button
        className="border border-slate-400 border-solid bg-slate-900 text-slate-50 px-2"
        type="button"
        onClick={navigateToModule}
      >
        Search
      </button>
    </form>
  );
}

export default memo(ModuleSearch);
