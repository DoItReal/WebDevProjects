"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSignById = exports.deleteSignById = exports.createSign = exports.getSignByRUS = exports.getSignByDE = exports.getSignByEN = exports.getSignByBG = exports.getSigns = exports.SignModel = void 0;
const mongoose_1 = require("mongoose");
// Sign Config
const SignSchema = new mongoose_1.default.Schema({
    bg: { type: String, required: true },
    en: { type: String, required: false },
    de: { type: String, required: false },
    rus: { type: String, required: false },
    allergens: { type: [Number], required: false }
});
exports.SignModel = mongoose_1.default.model('Sign', SignSchema);
// Sign Actions
const getSigns = () => exports.SignModel.find();
exports.getSigns = getSigns;
const getSignByBG = (bg) => exports.SignModel.findOne({ bg });
exports.getSignByBG = getSignByBG;
const getSignByEN = (en) => exports.SignModel.findOne({ en });
exports.getSignByEN = getSignByEN;
const getSignByDE = (de) => exports.SignModel.findOne({ de });
exports.getSignByDE = getSignByDE;
const getSignByRUS = (rus) => exports.SignModel.findOne({ rus });
exports.getSignByRUS = getSignByRUS;
const createSign = (values) => new exports.SignModel(values).save().then((sign) => sign.toObject());
exports.createSign = createSign;
const deleteSignById = (id) => exports.SignModel.findOneAndDelete({ _id: id });
exports.deleteSignById = deleteSignById;
const updateSignById = (id, values) => exports.SignModel.findByIdAndUpdate(id, values);
exports.updateSignById = updateSignById;
//import { deleteUserById, getUsers, getUserById } from '../db/users';
//# sourceMappingURL=signs.js.map