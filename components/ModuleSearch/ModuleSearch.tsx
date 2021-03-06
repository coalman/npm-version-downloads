import { useRouter } from "next/router";
import { memo, useRef, useCallback } from "react";

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
    if (refInput.current) {
      // replace first "/" with "$$" to handle scoped packages
      // NOTE: triple "$$$" is needed because of special syntax support from String.prototype.replace:
      //     | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
      const moduleName = refInput.current.value.replace("/", "$$$");
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
        className="text-center text-black border-black border-solid border"
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
        className="border border-black border-solid bg-white text-black px-2"
        type="button"
        onClick={navigateToModule}
      >
        Search
      </button>
    </form>
  );
}

export default memo(ModuleSearch);
