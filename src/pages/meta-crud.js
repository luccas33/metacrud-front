import { size } from "lodash";
import { createCustomCrudComp } from "../shared-comps/custom-crud-comp";

export const typeOptionsEnum = {
    text: 'text',
    number: 'number',
    checkbox: 'checkbox',
    select: 'select',
    crudselect: 'crudselect'
}

const typeSelectOptions = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Select', value: 'select' }
]

const metacrudSelectOptions = [
    ...typeSelectOptions,
    { label: 'Sub Form', value: 'subcrud' },
    { label: 'Link Form', value: 'linkcrud' }
]

const inputSizeOptionsEnum = {
    smaller: 'col-6 col-sm-4 col-md-3 col-lg-2',
    small: 'col-12 col-sm-6 col-md-4 col-lg-3',
    medium: 'col-12 col-md-6 col-lg-4',
    large: 'col-12 col-lg-6',
    larger: 'col-12'
}

const inputSizeSelectOptions = [
    {label: 'Smaller', value: inputSizeOptionsEnum.smaller},
    {label: 'Small', value: inputSizeOptionsEnum.small},
    {label: 'Medium', value: inputSizeOptionsEnum.medium},
    {label: 'Large', value: inputSizeOptionsEnum.large},
    {label: 'Larger', value: inputSizeOptionsEnum.larger}
]


function verifyInputProp(vo) {
    vo.prop = vo.label.trim().toLowerCase().replaceAll(/ +/g, '_');
    vo.type = vo.type || typeOptionsEnum.text;
}

const inputCrudInfo = {
    label: 'Inputs',
    name: 'metacrud-inputs',
    voModifier: verifyInputProp,
    inputs: [
        { label: 'Label', prop: 'label', size: inputSizeOptionsEnum.medium, onTable: true },
        { label: 'Type', prop: 'type', size: inputSizeOptionsEnum.medium, type: typeOptionsEnum.select, options: metacrudSelectOptions, onTable: true },
        { label: 'Select Form', prop: 'form', size: inputSizeOptionsEnum.medium, type: typeOptionsEnum.crudselect, requiredOn: {prop: 'type', values: ['subcrud', 'linkcrud']} },
        { label: 'Size', prop: 'size', size: inputSizeOptionsEnum.medium, type: typeOptionsEnum.select, options: inputSizeSelectOptions},
        { label: 'Required', prop: 'required', size: inputSizeOptionsEnum.medium, type: typeOptionsEnum.checkbox, onTable: true },
        { label: 'On Table', prop: 'onTable', size: inputSizeOptionsEnum.medium, type: typeOptionsEnum.checkbox }
    ]
}

const crudInfo = {
    label: 'Master Form',
    name: 'metacrud',
    inputs: [
        {label: 'Form Label', prop: 'label', size: inputSizeOptionsEnum.medium, onTable: true},
        {label: 'Path', prop: 'name', size: inputSizeOptionsEnum.medium, onTable: true}
    ],
    subcruds: [inputCrudInfo]
}

export function createMetaCrudPage() {
    return createCustomCrudComp(crudInfo);
}
