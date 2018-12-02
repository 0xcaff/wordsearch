export function sortBy<T>(accessor: (element: T) => number) {
  return (a: T, b: T) => accessor(b) - accessor(a);
}
