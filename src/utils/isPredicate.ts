import { IconItem, Style, Thickness } from '../types';
import capitalize from './capitalize';

export default function isPredicate(object: IconItem, propertyName: Style | Thickness) {
  const key = `is${capitalize(propertyName)}`;
  return (object as any).properties[key] === true;
}
