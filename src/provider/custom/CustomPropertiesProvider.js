// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import { Group, ListGroup } from '@bpmn-io/properties-panel';
import {
    AttributesProps,
    RelativePropertiesProps,
    IconTypeProps,
    PropertyProps,
    ChatbotRelationProps,
    GraphRelationProps,
    ApiWorkflowRelationProps,
    ApiRelationProps
} from './properties';

const LOW_PRIORITY = 400;

const CUSTOM_GROUPS = [
    CustomGroup,
    RelativeGroup,
    ChatbotRelationGroup,
    GraphRelationGroup,
    ApiWorkflowRelationGroup,
    ApiRelationGroup,
    PropertyGroup
];

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} injector
 */
export default function CustomPropertiesProvider(propertiesPanel, injector, comboOptions) {

    const normalizedComboOptions = normalizeComboOptions(comboOptions);

    // API ////////

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function (element) {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        //contract: if a group returns null, it should not be displayed at all
        return (groups) => {
            groups = groups.concat(this._getGroups(element, injector, normalizedComboOptions));
            return groups;
          }
    };

    this._getGroups = function (element, injector, comboOptionsByType) {
        const groups = CUSTOM_GROUPS.map(createGroup => createGroup(element, injector, comboOptionsByType));

        // contract: if a group returns null, it should not be displayed at all
        return groups.filter(group => group !== null);
    }


    // registration ////////

    // Register our custom magic properties provider.
    // Use a lower priority to ensure it is loaded after
    // the basic BPMN properties.
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'injector', 'comboOptions'];

// Create the custom group
function CustomGroup(element, injector, comboOptionsByType) {
    const translate = injector.get('translate');
    const attributeOptions = comboOptionsByType?.Attributes || [];
    const entries = [
        ...AttributesProps(element, attributeOptions), 
        ...IconTypeProps(element)
    ];
    const customGroup = {
        id: 'customGroup',
        label: translate('Custom Group'),
        component: Group,
        entries
    };

    if (customGroup.entries.length > 0) {
        return customGroup;
    }

    return null;
}

function RelativeGroup(element, injector, comboOptionsByType) {
    const translate = injector.get('translate');
    const relativeOptions = comboOptionsByType?.AttributesProps || [];
    const group = {
        label: translate('Relative process'),
        id: 'CamundaPlatform__ExtensionProperties',
        component: ListGroup,
        ...RelativePropertiesProps({ element, injector, comboOptions: relativeOptions})
    };

    if (group.items) {
        return group;
    }

    return null;
}

function ChatbotRelationGroup(element, injector) {
    const translate = injector.get('translate');
    const props = ChatbotRelationProps({ element });
    if (!props || !props.entries || props.entries.length === 0) return null;

    const group = {
        label: translate('Chatbot Relation') + ` (${props.relationCount})`,
        id: 'Custom__ChatbotRelation',
        component: Group,
        entries: props.entries
    };
    return group;
}

function GraphRelationGroup(element, injector) {
    const translate = injector.get('translate');
    const props = GraphRelationProps({ element });
    if (!props || !props.entries || props.entries.length === 0) return null;

    const group = {
        label: translate('Graph Relation') + ` (${props.relationCount})`,
        id: 'Custom__GraphRelation',
        component: Group,
        entries: props.entries
    };
    return group;
}

function ApiWorkflowRelationGroup(element, injector) {
    const translate = injector.get('translate');
    const props = ApiWorkflowRelationProps({ element });
    if (!props || !props.entries || props.entries.length === 0) return null;

    const group = {
        label: translate('API Workflow Relation') + ` (${props.relationCount})`,
        id: 'Custom__ApiWorkflowRelation',
        component: Group,
        entries: props.entries
    };
    return group;
}

function ApiRelationGroup(element, injector) {
    const translate = injector.get('translate');
    const props = ApiRelationProps({ element });
    if (!props || !props.entries || props.entries.length === 0) return null;

    const group = {
        label: translate('API Relation') + ` (${props.relationCount})`,
        id: 'Custom__ApiRelation',
        component: Group,
        entries: props.entries
    };
    return group;
}

function normalizeComboOptions(comboOptions) {
    if (Array.isArray(comboOptions)) {
        return {
            Attributes: comboOptions,
            Properties: comboOptions,
            AttributesProps: comboOptions,
        };
    }

    const empty = [];

    return {
        Attributes: Array.isArray(comboOptions?.Attributes) ? comboOptions.Attributes : empty,
        Properties: Array.isArray(comboOptions?.Properties) ? comboOptions.Properties : empty,
        AttributesProps: Array.isArray(comboOptions?.AttributesProps) ? comboOptions.AttributesProps : empty,
    };
}

function PropertyGroup(element, injector, comboOptionsByType) {

    const translate = injector.get('translate');
    const propertyOptions = comboOptionsByType?.Properties || [];
    const group = {
        label: translate('Properties'),
        id: 'CamundaPlatform__TaskProperties',
        component: ListGroup,
        ...PropertyProps({ element, injector, comboOptions: propertyOptions})
    };

    if (group.items) {
        return group;
    }

    return null;
}

