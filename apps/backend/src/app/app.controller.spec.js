import { __awaiter } from 'tslib';
import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
describe('AppController', () => {
  let app;
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      app = yield Test.createTestingModule({
        controllers: [AppController],
        providers: [AppService],
      }).compile();
    }),
  );
  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
//# sourceMappingURL=app.controller.spec.js.map
