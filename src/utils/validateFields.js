export const checkRequestFields = (feilds, reqBody) => {
  const resultFields = [];
  for (let i = 0; i < feilds.length; i++) {
    if (reqBody[feilds[i]] === undefined) {
      resultFields.push(feilds[i]);
    }
  }
  return resultFields;
};
