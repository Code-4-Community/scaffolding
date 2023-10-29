import { __decorate } from 'tslib';
import { Injectable } from '@nestjs/common';
let AppService = class AppService {
  getData() {
    return { message: 'Hello API' };
  }
};
AppService = __decorate([Injectable()], AppService);
export { AppService };
//# sourceMappingURL=app.service.js.map
