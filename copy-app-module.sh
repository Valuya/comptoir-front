#!/bin/bash
#set -x

# example usage
# Create a new module
# ./copy-app-module.sh balance something-new BALANCE:SOMETHING_NEW Balance:SomethingNew -e
#
# Overwrite a couple of files from a module to another:
# ./copy-app-module.sh balance pos --overwrite-dest -f '^/balance-menu.ts'  -f '^/balance-routing.module' BALANCE:POS Balance:Pos -e

WD="$(realpath $(dirname $0))"
MOD_SRC="$1"
MOD_DEST="$2"

SRC_PATH="$WD/src/app/$MOD_SRC"
[[ ! -d "$SRC_PATH" ]] && eccho "Invalid src module path: $SRC_PATH" && exit 1

SRC_MODULE_FILE_PATH="${SRC_PATH}/${MOD_SRC}.module.ts"
[[ ! -f "$SRC_MODULE_FILE_PATH" ]] && echo "Invalid src module file: $SRC_MODULE_FILE_PATH" && exit 1

shift
shift
SUBSTITUTIONS=""
OVERWRITE_DEST_PATH=false
DRY_RUN=true
SRC_FILES_REGEXP=""

NEXT_ARG_IS_SRC_FILE=false

while (("$#" > "0")); do
  case "$1" in
  --overwrite-dest)
    OVERWRITE_DEST_PATH="true"
    ;;
  -e)
    DRY_RUN="false"
    ;;
  -f)
    NEXT_ARG_IS_SRC_FILE=true
    ;;
  *)
    if [[ "$NEXT_ARG_IS_SRC_FILE" = "true" ]] ; then
      SRC_FILES_REGEXP="$SRC_FILES_REGEXP $1"
      NEXT_ARG_IS_SRC_FILE=false
    else
      SUBSTITUTIONS="$SUBSTITUTIONS $1"
    fi
    ;;
  esac
  shift
done

echo "sources: ${SRC_FILES_REGEXP}"
echo "substitutions: ${MOD_SRC}:${MOD_DEST} $SUBSTITUTIONS"
echo "force: $OVERWRITE_DEST_PATH"
echo "dry run: $DRY_RUN"
[ "$DRY_RUN" = "true" ] && echo "Use -e to apply changes"

[[ -z "$MOD_DEST" ]] && echo "Invalid des: $MOD_DEST" && exit 1
DEST_PATH="${WD}/src/app/${MOD_DEST}"
[[ -d "$DEST_PATH" && "$OVERWRITE_DEST_PATH" == "false" ]] && echo "dest path exists: $DEST_PATH" && exit 1

echo "mkdir $DEST_PATH"
if [ "$DRY_RUN" = "false" ]; then
  mkdir -p "$DEST_PATH"
fi

filterSources() {
  path="$1"
  rel_path="$(echo $path | sed s@${SRC_PATH}@@)"

  MATCH=false
  for REGEX in ${SRC_FILES_REGEXP}; do
    echo "$rel_path" | grep -e "$REGEX" && MATCH=true && break;
  done
 echo $MATCH
}

tmp=$(mktemp)
find "$SRC_PATH" -type d >"$tmp"

while read DIR; do
  INCLUDED=$(filterSources "$DIR")
  [ "$INCLUDED" = "false" ] && continue

  DEST_DIR_PATH=$(echo "$DIR" | sed "s:$SRC_PATH:$DEST_PATH:" | sed "s:${MOD_SRC}:${MOD_DEST}:g")

  echo "mkdir $DEST_DIR_PATH"
  if [ "$DRY_RUN" = "false" ]; then
    mkdir -p "$DEST_DIR_PATH"
  fi
done <"$tmp"

find "$SRC_PATH" -type f >$tmp
while read FILE; do
  INCLUDED=$(filterSources "$FILE")
  [ "$INCLUDED" = "false" ] && continue

  DEST_FILE_PATH=$(echo $FILE | sed "s:$SRC_PATH:$DEST_PATH:" | sed "s:${MOD_SRC}:${MOD_DEST}:g")

  sedTmp=$(mktemp)
  cat $FILE >$sedTmp

  for SUBSTITUTION in $SUBSTITUTIONS; do
    FROM=$(echo $SUBSTITUTION | cut -d: -f1)
    TO=$(echo $SUBSTITUTION | cut -d: -f2)
    sed -i "s:${FROM}:${TO}:g" $sedTmp
  done
  sed -i "s:${MOD_SRC}:${MOD_DEST}:g" $sedTmp

  echo "write into $DEST_FILE_PATH"
  if [ "$DRY_RUN" = "false" ]; then
    cat $sedTmp >$DEST_FILE_PATH
  fi

  rm "$sedTmp"
done <"$tmp"
rm "$tmp"


echo "COmpleted"
echo "sources: ${SRC_FILES_REGEXP}"
echo "substitutions: ${MOD_SRC}:${MOD_DEST} $SUBSTITUTIONS"
echo "force: $OVERWRITE_DEST_PATH"
echo "dry run: $DRY_RUN"
[ "$DRY_RUN" = "true" ] && echo "Use -e to apply changes"
