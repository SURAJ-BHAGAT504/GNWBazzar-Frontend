import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items) return [];
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();

    return items.filter(item => {
      return JSON.stringify(item).toLowerCase().includes(term);
    });
  }
}
