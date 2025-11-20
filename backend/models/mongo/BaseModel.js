const mongoose = require('mongoose');

function createModel(modelName, collectionName) {
    return mongoose.model(
        modelName,
        new mongoose.Schema(
            {
                _id: { type: String, required: true }
            },
            {
                strict: false,
                collection: collectionName,
                timestamps: true
            }
        ),
        collectionName
    );
}

module.exports = createModel;