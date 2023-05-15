import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  readonly #domSanitizer = inject(DomSanitizer);

  transform(value: string): string {
    return this.#domSanitizer.sanitize(
      SecurityContext.HTML,
      marked(value)
    ) as string;
  }
}
