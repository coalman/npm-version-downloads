import { useRouter } from "next/router";
import { type FC, memo, useRef, useCallback } from "react";
import styles from "./ModuleSearch.module.css";

export const ModuleSearch: FC<{ autoFocus?: boolean }> = memo(
  function ModuleSearch(props) {
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
      <form role="search" className={styles.container}>
        <input
          ref={setInput}
          className={styles.input}
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
          className={styles.searchButton}
          type="button"
          onClick={navigateToModule}
        >
          Search
        </button>
      </form>
    );
  }
);
