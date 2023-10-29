import { __decorate, __metadata } from 'tslib';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
let AppController = class AppController {
  constructor(appService) {
    this.appService = appService;
  }
  getData() {
    return 'this.appService.getData()';
  }
};
__decorate(
  [
    Get(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  AppController.prototype,
  'getData',
  null,
);
AppController = __decorate(
  [Controller(), __metadata('design:paramtypes', [AppService])],
  AppController,
);
export { AppController };
//# sourceMappingURL=app.controller.js.map
