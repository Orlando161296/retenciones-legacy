import { TestBed } from '@angular/core/testing';

import { PrintServiceService } from './print-service.service';

xdescribe('PrintServiceService', () => {
  let service: PrintServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintServiceService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });

});
