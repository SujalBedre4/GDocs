const Document = require('../Schema/DocumentSchema');

const getDocument = async (id) => {
  if (!id) return null;

  let doc = await Document.findById(id);
  if (doc) return doc;

  return await Document.create({ _id: id, data: '' });
};

module.exports = getDocument;

const updateDocument = async (id, data) => {
  return await Document.findByIdAndUpdate(id, { data }, { new: true });
};

module.exports = updateDocument;
