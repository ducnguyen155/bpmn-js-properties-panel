import CustomPropertiesProvider from './CustomPropertiesProvider';

/**
 * @typedef {{ label: string, value: string }} ComboOption
 * @typedef {{ Attributes: ComboOption[], Properties: ComboOption[], AttributesProps: ComboOption[] }} ComboOptions
 */

/** @type {ComboOptions} */
const EMPTY_COMBO_OPTIONS = {
  Attributes: [],
  Properties: [],
  AttributesProps: []
};

/**
 * @param {{ comboOptions?: ComboOptions }} [options]
 */
export function createCustomPropsModule({ comboOptions = EMPTY_COMBO_OPTIONS } = {}) {
  return {
    __init__: ['customPropertiesProvider'],
    customPropertiesProvider: ['type', CustomPropertiesProvider],
    comboOptions: ['value', comboOptions]
  };
};

export default {
  __init__: [ 'customPropertiesProvider' ],
  customPropertiesProvider: [ 'type', CustomPropertiesProvider ]
};