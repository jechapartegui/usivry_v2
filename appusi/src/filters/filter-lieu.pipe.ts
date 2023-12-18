import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterLieu'
})
export class FilterLieuPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
