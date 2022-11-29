export const sortByKey = (key: string) => (a: any, b: any) => {
  return a[key].localeCompare(b.name);
};
