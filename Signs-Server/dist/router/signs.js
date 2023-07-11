"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signs_1 = require("../controllers/signs");
exports.default = (router) => {
    router.get('/signs', signs_1.getAllSigns);
    router.delete('/signs/:id', signs_1.deleteSign);
    router.post('/signs/', signs_1.CreateSign);
    router.patch('/signs/:id', signs_1.updateSign);
};
//# sourceMappingURL=signs.js.map