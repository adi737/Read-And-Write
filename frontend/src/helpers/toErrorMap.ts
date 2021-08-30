export const toErrorMap = (errors: any) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ param, msg }) => {
    errorMap[param] = msg;
  });

  return errorMap;
};