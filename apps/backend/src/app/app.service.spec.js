import { __awaiter } from 'tslib';
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
describe('AppService', () => {
  let service;
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      const app = yield Test.createTestingModule({
        providers: [AppService],
      }).compile();
      service = app.get(AppService);
    }),
  );
  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
//# sourceMappingURL=app.service.spec.js.map
