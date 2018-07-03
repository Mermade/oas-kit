#!/bin/sh

echo '# OAS-Schema-Walker' > packages/oas-schema-walker/README.md
echo '' >> echo '# OAS-Schema-Walker' > packages/oas-schema-walker/README.md
npx jsdoc-to-markdown packages/oas-schema-walker/index.js >> packages/oas-schema-walker/README.md

echo '# RefTools' > packages/reftools/README.md
echo '' >> packages/reftools/README.md
npx jsdoc-to-markdown packages/reftools/lib/*.js >> packages/reftools/README.md

