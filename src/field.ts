// SVD Field element
//https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_registers.html#elem_field

import { AccessType } from './svd_parser'
import { WriteConstraint } from './write_constraint';
import { EnumeratedValues, EnumeratedValue } from './enumerated_value';
import { ModifiedWriteType } from './register';


interface FieldOptions {
    name: string;
    description: string;
    offset: number;
    width: number;
    accessType?: AccessType;
    enumValues?: EnumeratedValues;
    writeContraint?: WriteConstraint;
    modifiedWriteType?: ModifiedWriteType;
}

export class FieldNode implements FieldOptions{

    public name: string;
    public description: string;
    public offset: number;
    public width: number;
    public accessType?: AccessType;
    public enumValues?: EnumeratedValues;
    public writeContraint?: WriteConstraint;
    public modifiedWriteType?: ModifiedWriteType;
    // Actual value of the field (as an enum)
    public enumValue?: EnumeratedValue;

    // private enumerationValues: string[];
    // private enumerationMap: any;

    // constructor(private parent: RegisterNode, options: FieldOptions) {

    //     this.name = options.name;
    //     this.description = options.description;
    //     this.offset = options.offset;
    //     this.width = options.width;
    //     this.writeContraint = options.writeContraint;
    //     this.modifiedWriteType = options.modifiedWriteType;
    //     this.enumValues = options.enumValues;
        

    //     // If the parent is read-only OR write-only, this field must be the same
    //     if(parent.accessType === AccessType.ReadOnly
    //        || parent.accessType === AccessType.WriteOnly)
    //     {
    //         this.accessType = parent.accessType;
    //     }
    //     else if(options.accessType) {
    //         // Parent wasn't read OR write only, so take the provided access type
    //         this.accessType = options.accessType;
    //     }
    //     else {
    //         // Field access type wasn't provide, so default to parents access
    //         this.accessType = parent.accessType;
    //     }

    //     // Check if an enum (array) was defined for the field
    //     // if (options.enumValues) {
    //     //     this.enumValues = options.enumValues;
    //     //     this.enumerationMap = {};
    //     //     this.enumerationValues = [];

    //     //     for (const key in options.enumValues) {
    //     //         const name = options.enumValues.values[key].name;

    //     //         this.enumerationValues.push(name);
    //     //         this.enumerationMap[name] = key;
    //     //     }
    //     // }

    //     // Add this field to the parent register
    //     this.parent.addChild(this);
    // }
/*
    public getTreeNode(): TreeNode {
        const value = this.parent.extractBits(this.offset, this.width);
        let evalue = undefined;
        let label = this.name;

        const rangestart = this.offset;
        const rangeend = this.offset + this.width - 1;
        let context = 'field';

        label += `[${rangeend}:${rangestart}]`;
        if (this.name.toLowerCase() === 'reserved')  {
            context = 'field-res';
        }
        else {
            if (this.accessType === AccessType.WriteOnly) {
                label += ' - <Write Only>';
            }
            else {
                let formattedValue: string = '';

                switch (this.getFormat()) {
                    case NumberFormat.Decimal:
                        formattedValue = value.toString();
                        break;
                    case NumberFormat.Binary:
                        formattedValue = binaryFormat(value, this.width);
                        break;
                    case NumberFormat.Hexidecimal:
                        formattedValue = hexFormat(value, Math.ceil(this.width / 4), true);
                        break;
                    default:
                        formattedValue = this.width >= 4 ? hexFormat(value, Math.ceil(this.width / 4), true) : binaryFormat(value, this.width);
                        break;
                }
                
                if (this.enumeration && this.enumeration[value]) {
                    evalue = this.enumeration[value];
                    label += ` = ${evalue.name} (${formattedValue})`;
                }
                else {
                    label += ` = ${formattedValue}`;
                }
            }
        }

        if (this.parent.accessType === AccessType.ReadOnly) {
            context = 'field-ro';
        }

        return new TreeNode(label, vscode.TreeItemCollapsibleState.None, context, this);
    }

    public performUpdate(): Thenable<any> {
        return new Promise((resolve, reject) => {
            if (this.enumeration) {
                vscode.window.showQuickPick(this.enumerationValues).then((val) => {
                    if (val === undefined) { return reject('Input not selected'); }
                    
                    const numval = this.enumerationMap[val];
                    this.parent.updateBits(this.offset, this.width, numval).then(resolve, reject);
                });
            }
            else {
                vscode.window.showInputBox({ prompt: 'Enter new value: (prefix hex with 0x, binary with 0b)' }).then((val) => {
                    const numval = parseInteger(val);
                    if (numval === undefined) {
                        return reject('Unable to parse input value.');
                    }
                    this.parent.updateBits(this.offset, this.width, numval).then(resolve, reject);
                });
            }
        });
    }

    public getCopyValue(): string {
        const value = this.parent.extractBits(this.offset, this.width);
        switch (this.getFormat()) {
            case NumberFormat.Decimal:
                return value.toString();
            case NumberFormat.Binary:
                return binaryFormat(value, this.width);
            case NumberFormat.Hexidecimal:
                return hexFormat(value, Math.ceil(this.width / 4), true);
            default:
                return this.width >= 4 ? hexFormat(value, Math.ceil(this.width / 4), true) : binaryFormat(value, this.width);
        }
    }

    public getFormat(): NumberFormat {
        if (this.format !== NumberFormat.Auto) { return this.format; }
        else { return this.parent.getFormat(); }
    }

    public update() {}

    public _saveState(path: string): NodeSetting[] {
        if (this.format !== NumberFormat.Auto) {
            return [ {node: `${path}.${this.name}`, format: this.format }];
        }
        else {
            return [];
        }
    }

    public _findByPath(path: string[]): BaseNode {
        if (path.length === 0) { return this; }
        else { return undefined; }
    }
    */
}