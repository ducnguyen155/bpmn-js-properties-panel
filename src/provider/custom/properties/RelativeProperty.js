import { SelectEntry, TextFieldEntry } from '@bpmn-io/properties-panel'
import {
  useService
} from '../../../hooks';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

export default function RelativeProperty(props) {

  const {
    idPrefix,
    property,
    comboOptions
  } = props;

  const entries = [{
    id: idPrefix + '-NextProcess',
    component: NextProcess,
    idPrefix,
    property,
    comboOptions
  },
  {
    id: idPrefix + '-ChildProcess',
    component: ChildProcess,
    idPrefix,
    property,
    comboOptions
  }, {
    id: idPrefix + '-PrevProcess',
    component: PrevProcess,
    idPrefix,
    property,
    comboOptions
  }];

  return entries;
}

function NextProcess(props) {
  const {
    idPrefix,
    element,
    property,
    comboOptions
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: property,
      properties: {
        next: value
      }
    });
  };

  const getValue = () => {
    return property.next;
  };

  const [relates, setRelates] = useState([]);

  useEffect(() => {
    function fetchSpells() {
      setRelates(comboOptions);
    }

    fetchSpells();
  }, [setRelates]);

  const getOptions = () => {
    return [
      {
        label: '',
        value: undefined
      },
      ...relates
    ];
  };

  return SelectEntry({
    element: property,
    id: idPrefix + '-NextProcess',
    label: translate('Next Process ID'),
    getValue,
    setValue,
    getOptions,
    debounce
  });
}

function ChildProcess(props) {
  const {
    idPrefix,
    element,
    property,
    comboOptions
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: property,
      properties: {
        child: value
      }
    });
  };

  const getValue = () => {
    return property.child;
  };

  const [relates, setRelates] = useState([]);

  useEffect(() => {
    function fetchSpells() {
      setRelates(comboOptions);
    }

    fetchSpells();
  }, [setRelates]);

  const getOptions = () => {
    return [
      {
        label: '',
        value: undefined
      },
      ...relates
    ];
  };

  return SelectEntry({
    element: property,
    id: idPrefix + '-ChildProcess',
    label: translate('Child Process ID'),
    getValue,
    setValue,
    getOptions,
    debounce
  });
}

function PrevProcess(props) {
  const {
    idPrefix,
    element,
    property,
    comboOptions
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: property,
      properties: {
        previous: value
      }
    });
  };

  const getValue = () => {
    return property.previous;
  };

  const [relates, setRelates] = useState([]);

  useEffect(() => {
    function fetchSpells() {
      setRelates(comboOptions);
    }

    fetchSpells();
  }, [setRelates]);

  const getOptions = () => {
    return [
      {
        label: '',
        value: undefined
      },
      ...relates
    ];
  };

  return SelectEntry({
    element: property,
    id: idPrefix + '-PrevProcess',
    label: translate('Previous Process ID'),
    getValue,
    setValue,
    getOptions,
    debounce
  });
}