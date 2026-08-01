/**
 * Helper to parse and sanitize pagination query parameters
 * @param {Object} query - Express request query object (req.query)
 * @returns {Object} { page, limit, skip }
 */
export const getPaginationParams = (query = {}) => {
  let page = Number(query.page);
  let limit = Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = 10;
  } else if (limit > 100) {
    limit = 100;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Helper to construct standard pagination response payload
 * @param {Object} params
 * @param {number} params.page - Current page number
 * @param {number} params.limit - Page size limit
 * @param {number} params.totalRecords - Total matching document count
 * @param {Array} params.data - Retrieved items array
 * @param {string} [params.message] - Optional message
 * @returns {Object} Standard paginated response object
 */
export const formatPaginatedResponse = ({
  page,
  limit,
  totalRecords,
  data = [],
  message = "Data retrieved successfully",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  return {
    success: true,
    message,
    pagination: {
      currentPage: page,
      limit,
      totalPages,
      totalRecords,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    data,
  };
};

/**
 * Execute a read-only Mongoose query with the project pagination standard.
 * The supplied query should already include any required sort, projection, or
 * population. It is made lean here because paginated list results are not
 * mutated before being returned.
 */
export const paginateQuery = async ({
  model,
  filter = {},
  query,
  pagination,
  message,
  legacy,
}) => {
  const { page, limit, skip } = getPaginationParams(pagination);

  const [totalRecords, data] = await Promise.all([
    model.countDocuments(filter),
    query.skip(skip).limit(limit).lean(),
  ]);

  const response = formatPaginatedResponse({
    page,
    limit,
    totalRecords,
    data,
    message,
  });

  if (!legacy) {
    return response;
  }

  const aliases = {};

  if (legacy.dataKey) {
    aliases[legacy.dataKey] = {
      enumerable: true,
      get: () => response.data,
    };
  }

  if (legacy.totalKey) {
    aliases[legacy.totalKey] = {
      enumerable: true,
      get: () => response.pagination.totalRecords,
    };
  }

  if (legacy.pageKey) {
    aliases[legacy.pageKey] = {
      enumerable: true,
      get: () => response.pagination.currentPage,
    };
  }

  if (legacy.limitKey) {
    aliases[legacy.limitKey] = {
      enumerable: true,
      get: () => response.pagination.limit,
    };
  }

  if (legacy.totalPagesKey) {
    aliases[legacy.totalPagesKey] = {
      enumerable: true,
      get: () => response.pagination.totalPages,
    };
  }

  Object.defineProperties(response, aliases);

  return response;
};
