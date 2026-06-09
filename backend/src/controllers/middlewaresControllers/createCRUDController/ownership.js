const hasOwnershipField = (Model) => {
  try {
    return Model.schema && Model.schema.paths && Model.schema.paths.createdBy;
  } catch {
    return false;
  }
};

const scopeOwnership = (Model, req, query = {}) => {
  if (req.admin && hasOwnershipField(Model)) {
    return { ...query, createdBy: req.admin._id };
  }
  return query;
};

const limitToCreatedBy = (Model, req, additionalFilter = {}) => {
  return scopeOwnership(Model, req, { ...additionalFilter, removed: false });
};

module.exports = { hasOwnershipField, scopeOwnership, limitToCreatedBy };
