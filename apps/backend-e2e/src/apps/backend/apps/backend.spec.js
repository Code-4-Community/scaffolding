import { __awaiter } from "tslib";
import axios from 'axios';
describe('GET /api', () => {
    it('should return a message', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios.get(`/api`);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({ message: 'Hello API' });
    }));
});
//# sourceMappingURL=backend.spec.js.map