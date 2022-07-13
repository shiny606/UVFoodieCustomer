import { TestBed } from '@angular/core/testing';

import { AndroidPermissionService } from './android-permission.service';

describe('AndroidPermissionService', () => {
  let service: AndroidPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AndroidPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
