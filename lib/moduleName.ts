/**
 * Encode module names to be suitable for the api/module/[module]/stats route.
 *
 * This is needed for scoped package names.
 */
export function encodeModuleName(moduleName: string): string {
  // replace first "/" with "$$" to handle scoped packages
  // NOTE: triple "$$$" is needed because of special syntax support from String.prototype.replace:
  //     | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
  return moduleName.replace("/", "$$$");
}

/**
 * Decodes the transformation from encodeModuleName.
 *
 * @see encodeModuleName
 */
export function decodeModuleName(value: string): string {
  return value.replace("$$", "/");
}
