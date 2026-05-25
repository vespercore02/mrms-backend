const getPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const getPagingData = (result, page, limit) => {
  const { count, rows } = result;
  const totalPages = Math.ceil(count / limit);

  return {
    totalItems: count,
    totalPages,
    currentPage: page,
    limit,
    data: rows,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};