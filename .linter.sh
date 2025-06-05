#!/bin/bash
cd /home/kavia/workspace/code-generation/journeyjotter-31263-27168f11/journeyjotter
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

