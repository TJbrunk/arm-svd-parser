// import * as fs from 'fs';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

import {SvdParser} from './src/svd_parser'

class Startup {

    public static main(): number {
        SvdParser.Parse('/home/tyler/Projects/arm-svd-parser/svd-example.xml')
        return 0;
    }
}


Startup.main();