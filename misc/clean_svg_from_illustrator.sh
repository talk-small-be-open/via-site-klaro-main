#!/bin/sh

FILE=$1

# rm $DIR/hexenweg_cleaned.svg

svgo --config clean_svg_from_illustrator.config.js "$FILE" -o "${FILE}_cleaned.svg"

