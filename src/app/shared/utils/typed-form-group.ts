import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

type StandardTypedForm<TForm> = [TForm] extends [Date]
  ? FormControl<Date>
  : [TForm] extends [Array<infer TItem>]
  ? TItem extends Date
    ? FormControl<Date[]>
    : TItem extends object
    ? FormArray<TypedFormGroup<TItem>>
    : FormControl<Array<TItem>>
  : [TForm] extends [object]
  ? TypedFormGroup<TForm>
  : FormControl<TForm>;

export type TypedFormGroup<
  TFormData extends object,
  TException extends Partial<Record<keyof TFormData, AbstractControl>> = object
> = TException extends Partial<Record<keyof TFormData, AbstractControl>>
  ? FormGroup<{
      [TFormKey in keyof TFormData]: StandardTypedForm<TFormData[TFormKey]>;
    }>
  : FormGroup<{
      [TFormKey in keyof TFormData]: StandardTypedForm<TFormData[TFormKey]>;
    }>;
