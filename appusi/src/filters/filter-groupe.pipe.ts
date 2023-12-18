import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGroupe'
})
export class FilterGroupePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
