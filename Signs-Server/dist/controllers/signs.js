"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSign = exports.updateSign = exports.deleteSign = exports.getAllSigns = void 0;
const signs_1 = require("../db/signs");
const getAllSigns = async (req, res) => {
    try {
        const signs = await (0, signs_1.getSigns)();
        return res.status(200).json(signs);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllSigns = getAllSigns;
const deleteSign = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSign = await (0, signs_1.deleteSignById)(id);
        return res.json(deletedSign);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteSign = deleteSign;
const updateSign = async (req, res) => {
    try {
        const { id } = req.params;
        const { bg } = req.body;
        if (!bg) {
            return res.sendStatus(400);
        }
        const sign = await (0, signs_1.getSignById)(id);
        sign.bg = bg;
        await sign.save();
        return res.status(200).json(sign).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.updateSign = updateSign;
const CreateSign = async (req, res) => {
    try {
        const { bg, en, de, rus, allergens } = req.body;
        if (!bg) {
            return res.sendStatus(400);
        }
        const existingSign = await (0, signs_1.getSignByBG)(bg);
        if (existingSign) {
            return res.sendStatus(400);
        }
        const sign = await (0, signs_1.createSign)({
            bg,
            en,
            de,
            rus,
            allergens
        });
        return res.status(200).json(sign).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.CreateSign = CreateSign;
//# sourceMappingURL=signs.js.map