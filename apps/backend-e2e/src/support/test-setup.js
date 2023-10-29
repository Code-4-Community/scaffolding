/* eslint-disable */
import { __awaiter } from "tslib";
import axios from 'axios';
module.exports = function () {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Configure axios for tests to use.
        const host = (_a = process.env.HOST) !== null && _a !== void 0 ? _a : 'localhost';
        const port = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : '3000';
        axios.defaults.baseURL = `http://${host}:${port}`;
    });
};
//# sourceMappingURL=test-setup.js.map