#!/bin/bash
# without this filename completion for command wont work
compileCmd='../node_modules/typescript/bin/tsc --project code/tsconfig_dogs.json --watch'
COMPILED_TS_TO_JS_FILE='code/typescriptCompiled/imagesTreeCopyNResize.js'

echo starting tsc compiliation of *.ts to *.js
../node_modules/typescript/bin/tsc --project code/tsconfig_dogs.json  #compile-every-time
echo compilation done
####### uncomment below if compile-every-time is not used
# if !(test -f "$COMPILED_TS_TO_JS_FILE"); then
#   echo runnable file: $COMPILED_TS_TO_JS_FILE " not found. "
#   echo 'to compile *.ts to *.js, run this command:'
#   echo $compileCmd
#   exit;
# fi
######

commd="node.exe $COMPILED_TS_TO_JS_FILE --imgSrcFolder jpegs/origJPEG --PIXMINI 15 --PIXFULL 445 --DRY_RUN false"

# echo $(tput setaf 1) # set font color 1==red
# echo $(tput setaf 1) command line: $(tput sgr0)
# echo $commd
echo -------------------------------------
# now run it
eval $commd

##### uncomment below if compile-every-time is not used
# echo $(tput setaf 1)!!!! NOTICE: after modifying .ts source code, compile with this command: $(tput sgr0)
# echo -n $(tput setaf 2) # this sets color GREEN
# echo $compileCmd
# echo -n $(tput sgr0) # this resets color
# echo above stays in the window and recompiles .ts files whenever modified
######

