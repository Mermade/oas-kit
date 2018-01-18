#!/bin/sh
echo '# reftools' > README.md
echo '[![Greenkeeper badge](https://badges.greenkeeper.io/Mermade/reftools.svg)](https://greenkeeper.io/)' >> README.md
npx jsdoc-to-markdown lib/*.js >> README.md
