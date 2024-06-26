import {
    getBusinessObject,
    is,
    isAny
  } from 'bpmn-js/lib/util/ModelUtil';

import RelativeProperty from './RelativeProperty';

import {
  createElement
} from '../../../utils/ElementUtil';

import {
  getExtensionElementsList
} from '../../../utils/ExtensionElementsUtil';

import { without } from 'min-dash';


export function RelativePropertiesProps({ element, injector, namespace = 'custom' }) {

  if (!isAny(element, ['bpmn:Task'])) {
    return;
  }
  let businessObject = getRelevantBusinessObject(element);

  // do not offer for empty pools
  if (!businessObject) {
    return;
  }

  const properties = getPropertiesList(businessObject, namespace) || [];

  const bpmnFactory = injector.get('bpmnFactory'),
        commandStack = injector.get('commandStack');

  const items = properties.map((property, index) => {
  const id = element.id + '-relavtiveProperty-' + index;

    return {
      id,
      label: 'Relative ' + (index + 1),
      entries: RelativeProperty({
        idPrefix: id,
        element,
        property
      }),
      autoFocusEntry: id + '-relavtiveProperty',
      remove: removeFactory({ commandStack, element, property, namespace })
    };
  });

  return {
    items,
    add: addFactory({ bpmnFactory, commandStack, element, namespace }),
    shouldSort: false
  };
}

function removeFactory({ commandStack, element, property, namespace }) {
  return function(event) {
    event.stopPropagation();

    const commands = [];

    const businessObject = getRelevantBusinessObject(element);
    const extensionElements = businessObject.get('extensionElements');
    const properties = getProperties(businessObject, namespace);

    if (!properties) {
      return;
    }

    const propertyName = getPropertyName(namespace);

    const values = without(properties.get(propertyName), property);

    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: properties,
        properties: {
          [ propertyName ]: values
        }
      }
    });

    // remove custom:Properties if there are no properties anymore
    if (!values.length) {

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: without(extensionElements.get('values'), properties)
          }
        }
      });
    }

    commandStack.execute('properties-panel.multi-command-executor', commands);
  };
}

function addFactory({ bpmnFactory, commandStack, element, namespace }) {
  return function(event) {
    event.stopPropagation();

    let commands = [];

    const businessObject = getRelevantBusinessObject(element);

    let extensionElements = businessObject.get('extensionElements');

    // (1) ensure extension elements
    if (!extensionElements) {
      extensionElements = createElement(
        'bpmn:ExtensionElements',
        { values: [] },
        businessObject,
        bpmnFactory
      );

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: { extensionElements }
        }
      });
    }

    const propertyName = getPropertyName(namespace);

    // (2) ensure custom:Properties
    let properties = getProperties(businessObject, namespace);

    if (!properties) {
      const parent = extensionElements;

      properties = createElement(`${ namespace }:Relationships`, {
        [ propertyName ]: []
      }, parent, bpmnFactory);

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [ ...extensionElements.get('values'), properties ]
          }
        }
      });
    }

    // (3) create custom:Property
    const property = createElement(`${ namespace }:Relation`, {}, properties, bpmnFactory);

    // (4) add property to list
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: properties,
        properties: {
          [ propertyName ]: [ ...properties.get(propertyName), property ]
        }
      }
    });

    // (5) commit all updates
    commandStack.execute('properties-panel.multi-command-executor', commands);
  };
}


// helper //////////////////

export function getRelevantBusinessObject(element) {
  let businessObject = getBusinessObject(element);

  if (is(element, 'bpmn:Participant')) {
    return businessObject.get('processRef');
  }

  return businessObject;
}

function getPropertyName(namespace = 'custom') {
  if (namespace === 'custom') {
    return 'properties';
  }

  return 'values';
}

export function getProperties(element, namespace = 'custom') {
  const businessObject = getRelevantBusinessObject(element);
  return getExtensionElementsList(businessObject, `${namespace}:Relationships`)[ 0 ];
}

export function getPropertiesList(element, namespace = 'custom') {
  const businessObject = getRelevantBusinessObject(element);
  const properties = getProperties(businessObject, namespace);

  return properties && properties.get(getPropertyName(namespace));
}