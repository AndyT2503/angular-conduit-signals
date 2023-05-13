import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListSelectComponent } from './tag-list-select.component';

describe('TagListSelectComponent', () => {
  let component: TagListSelectComponent;
  let fixture: ComponentFixture<TagListSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TagListSelectComponent]
    });
    fixture = TestBed.createComponent(TagListSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
