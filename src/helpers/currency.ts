export const formatCurrency = (value: string | number) => {
  let parsedValue = typeof value === 'string' ? +value : value;

  if (value === null || value === undefined) {
    parsedValue = 0;
  }

  return parsedValue.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
};
