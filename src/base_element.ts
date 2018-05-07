
// Common propterties and methods that all SVD elements should have/handle
export abstract class BaseElement {

    name: string;
    description?: string;

    constructor (xml: any, description?: string) {
        this.name = xml.name[0];

        if(description) {
            this.description = description;
        }
        else {
            this.description = xml.description && xml.description[0];
        }
    };

    public abstract parseChildren(xml: any)
    }