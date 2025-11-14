import { SelectEntry, TextFieldEntry } from '@bpmn-io/properties-panel'
import {
    useService
} from '../../../hooks';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

export default function Property(props) {

    const {
        idPrefix,
        property,
        comboOptions
    } = props;

    const entries = [{
        id: idPrefix + '-PropertyValue',
        component: TaskProperty,
        idPrefix,
        property,
        comboOptions
    }];

    return entries;
}

function TaskProperty(props) {
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
                value: value
            }
        });
    };

    const getValue = () => {
        return property.value;
    };

    const [propertyList, setProperty] = useState([]);

    useEffect(() => {
        function fetchSpells() {
            setProperty(comboOptions);
        }

        fetchSpells();
    }, [setProperty]);

    const getOptions = () => {
        return [
            {
                label: '',
                value: undefined
            },
            ...propertyList
        ];
    };

    return SelectEntry({
        element: property,
        id: idPrefix + '-PropertyValue',
        getValue,
        setValue,
        getOptions,
        debounce
    });
}
