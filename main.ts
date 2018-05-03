// import * as fs from 'fs';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

import {BaseElement, BaseElementOptions} from './src/svd_common'

class Startup {


    public static parsePeripheral(element: string) {
       let ele = BaseElement.InitElement(element) ;
       console.log(ele);
    }

    public static parseXml (err, xml: string) {
        if(err) throw err;
        xml2js.parseString(xml, (err, result) => {
            // Skip over CPU/Device stuff for now

            // At least one peripheral must be defined, but handle if there is more than one
            result.device.peripherals.forEach(peripheral => {
                // https://www.keil.com/pack/doc/CMSIS/SVD/html/elem_peripherals.html
                peripheral.peripheral.forEach(element => {
                    // For each 'peripheral' in the peripherals section, parse it into the correct element
                    this.parsePeripheral(element);
                });
            });
            //console.log(result)
        });
    }

    public static main(): number {
        // let SVDFile = 'svd-example.xml';
        let SVDFile = 'C:/Users/tylerb/Downloads/SiliconLabs.EFM32GG_DFP.5.4.1/SVD/EFM32GG/EFM32GG995F1024.svd';
        console.log('Loading SVD');

        fs.readFile(SVDFile, 'utf8', (err, xml) => Startup.parseXml(err, xml));
        // {
        //    if(err) throw err;
        // //    console.log(data);
        // });
        console.log('Parse complete');
        return 0;
    }

    
}



Startup.main();