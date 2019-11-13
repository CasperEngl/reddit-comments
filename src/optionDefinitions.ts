import * as downloadsFolder from 'downloads-folder';
import { OptionDefinition } from 'command-line-args';

export const optionDefinitions: OptionDefinition[] = [
  {
    name: 'url',
    alias: 'u',
    type: String,
    defaultOption: true,
  },
  {
    name: 'headless',
    alias: 'h',
    type: Boolean,
    defaultValue: true,
  },
  {
    name: 'remove-ago',
    alias: 'a',
    type: Boolean,
    defaultValue: true,
  },
  {
    name: 'path',
    alias: 'p',
    type: String,
    defaultValue: downloadsFolder(),
  },
];
