import { html } from 'htm/preact';
import {
  getBusinessObject,
  is,
  isAny
} from 'bpmn-js/lib/util/ModelUtil';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from '../../../hooks';

// import hooks from the vendored preact package
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

export function AttributesProps(element, comboOptions = []) {
  if (!isAny(element, ['bpmn:Task', 'bpmn:Process', 'bpmn:Participant' ])) {
    return [];
  }
  return [
    {
      id: 'newAttribute',
      element,
      component: NewAttribute,
      isEdited: isSelectEntryEdited,
      comboOptions: comboOptions
    }
  ];
}

function NewAttribute(props) {
  const { element, id, comboOptions } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const process = getProcess(element);

  const getValue = () => {
    return process.newAttribute || '';
  };

  const setValue = value => {
    return modeling.updateModdleProperties(element, process, {
      newAttribute: value
    });
  };

  const [ attriNames, setAttriNames ] = useState([]);

  useEffect(() => {
    function fetchAttriNames() {
      setAttriNames(comboOptions);
    }

    fetchAttriNames();
  }, [ setAttriNames ]);

  const getOptions = () => {
    return [
      {
        label: '',
        value: undefined
      },
      ...attriNames
    ];
  };

  return html`<${SelectEntry}
    id=${id}
    element=${element}
    description=${translate('For Attribute Group Name')}
    label=${translate('Attribute Group Name')}
    getValue=${getValue}
    setValue=${setValue}
    getOptions=${getOptions}
    debounce=${debounce}
  />`;
}

// helper /////////////////////
function getProcess(element) {
  return isAny(element, ['bpmn:Process', 'bpmn:Task']) ?
    getBusinessObject(element) :
    getBusinessObject(element).get('processRef');
}
