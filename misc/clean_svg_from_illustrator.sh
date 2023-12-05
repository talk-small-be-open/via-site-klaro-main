#!/bin/sh

FILE=$1

# rm $DIR/hexenweg_cleaned.svg

# See https://svgo.dev/docs/

svgo --config clean_svg_from_illustrator.config.js "$FILE" -o "${FILE}_cleaned.svg"

