#!/bin/bash
#set -x

WD="$(realpath $(dirname $0))"
MOD_SRC="$1"
MOD_DEST="$2"

SRC_PATH="$WD/src/app/$MOD_SRC"
[[ ! -d "$SRC_PATH" ]] && eccho "Invalid src module path: $SRC_PATH" && exit 1

SRC_MODULE_FILE_PATH="${SRC_PATH}/${MOD_SRC}.ts"
[[ ! -f "$SRC_MODULE_FILE_PATH" ]]  && eccho "Invalid src module dile: $SRC_MODULE_FILE_PATH" && exit 1

[[ -z "$MOD_DEST" ]]  && echo "Invalid des: $MOD_DEST" && exit 1
DEST_PATH="${WD}/src/app/${MOD_DEST}"
[[ -d "$DEST_PATH" ]]  && echo "dest path exists: $DEST_PATH" && exit 1

shift;
shift;
SUBSTITUTIONS="$@"

mkdir -pv $DEST_PATH

tmp=$(mktemp)
find "$SRC_PATH" -type d >$tmp

while read DIR; do
  DEST_DIR_PATH=$(echo $DIR | sed "s:$SRC_PATH:$DEST_PATH:" | sed "s:${MOD_SRC}:${MOD_DEST}:g")
  mkdir -p $DEST_DIR_PATH
done < $tmp

find "$SRC_PATH" -type f >$tmp
while read FILE; do
  DEST_FILE_PATH=$(echo $FILE | sed "s:$SRC_PATH:$DEST_PATH:" | sed "s:${MOD_SRC}:${MOD_DEST}:g")

  sedTmp=$(mktemp)
  cat $FILE > $sedTmp

  for SUBSTITUTION in $SUBSTITUTIONS ; do
    FROM=$(echo $SUBSTITUTION | cut -d: -f1)
    TO=$(echo $SUBSTITUTION | cut -d: -f2)
    set -x
    sed -i "s:${FROM}:${TO}:g" $sedTmp
    set +x
  done
  sed -i "s:${MOD_SRC}:${MOD_DEST}:g" $sedTmp

  cat $sedTmp > $DEST_FILE_PATH
  rm $sedTmp
done < $tmp
rm $tmp
