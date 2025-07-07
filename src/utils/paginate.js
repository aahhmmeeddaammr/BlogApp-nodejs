export const paginate = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 5;
  const offset = (page - 1) * limit;
  return { limit, offset, currentPage: page };
};
