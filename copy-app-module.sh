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

printStatus() {

echo -n "substitutions: ${MOD_SRC}:${MOD_DEST} $SUBSTITUTIONS"
[ -z "${SUBSTITUTIONS}" ] && echo -n "$(printf '\t')  # Pass 'src:dest' expressions to pass through sed s:\$src:\$dest: "
echo

echo -n "sources: ${SRC_FILES_REGEXP}"
[ -z "${SRC_FILES_REGEXP}" ] && echo -n "$(printf '\t')  # Use -f <pattern> to filter source files"
echo

echo -n  "force: $OVERWRITE_DEST_PATH"
[ "$OVERWRITE_DEST_PATH" != "true" ] && echo -n "$(printf '\t')  # Use --overwrite-dest to force"
echo

echo -n "dry run: $DRY_RUN"
[ "$DRY_RUN" = "true" ] && echo -n "$(printf '\t')  # Use -e to apply changes"
echo
}

printStatus
echo

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

  if [[ -z "${SRC_FILES_REGEXP}" || "${#SRC_FILES_REGEXP[*]}" = "0" ]] ; then
    echo "true"
    return 0
  fi
  MATCH=false
  for REGEX in ${SRC_FILES_REGEXP}; do
    echo "$rel_path" | grep -e "$REGEX" && MATCH=true && break;
  done
  echo $MATCH
}

tmp=$(mktemp)
find "$SRC_PATH" -type d >"$tmp"

echo

while read DIR; do
  INCLUDED=$(filterSources "$DIR")
  [ "$INCLUDED" = "false" ] && continue

  DEST_DIR_PATH=$(echo "$DIR" | sed "s:$SRC_PATH:$DEST_PATH:" | sed "s:${MOD_SRC}:${MOD_DEST}:g")

  echo "mkdir $DEST_DIR_PATH"
  if [ "$DRY_RUN" = "false" ]; then
    mkdir -p "$DEST_DIR_PATH"
  fi
done <"$tmp"

echo

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


echo
echo
printStatus
echo
echo "COmpleted"
