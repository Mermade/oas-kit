const fs = require('fs');
const yaml = require('js-yaml');

const applicator = require('./index.js');

if (process.argv.length>=3) {
    const overlay = yaml.safeLoad(fs.readFileSync(process.argv[2],'utf8'),{json:true});
    const openapi = yaml.safeLoad(fs.readFileSync(process.argv[3],'utf8'),{json:true});
    if (overlay.overlay) {
        if (overlay.overlay.description) {
            console.log('# Applied:',overlay.overlay.description);
            const result = applicator.apply(overlay,openapi,{});
            console.log(yaml.safeDump(result));
        }
    }
    else {
        console.warn(process.argv[2],'does not seem to be a valid overlay document');
    }
}
else {
    console.log('Usage: apply {overlayfile} {openapifile}');
}

