#!/bin/sh


# scour 0.38.2
# Copyright Jeff Schiller, Louis Simard, 2010
# Usage: scour [INPUT.SVG [OUTPUT.SVG]] [OPTIONS]

# If the input/output files are not specified, stdin/stdout are used. If the
# input/output files are specified with a svgz extension, then compressed SVG is
# assumed.

# Options:
#   --version                      show program's version number and exit
#   -h, --help                     show this help message and exit
#   -q, --quiet                    suppress non-error output
#   -v, --verbose                  verbose output (statistics, etc.)
#   -i INPUT.SVG                   alternative way to specify input filename
#   -o OUTPUT.SVG                  alternative way to specify output filename

#   Optimization:
#     --set-precision=NUM          set number of significant digits (default: 5)
#     --set-c-precision=NUM        set number of significant digits for control
#                                  points (default: same as '--set-precision')
#     --disable-simplify-colors    won't convert colors to #RRGGBB format
#     --disable-style-to-xml       won't convert styles into XML attributes
#     --disable-group-collapsing   won't collapse <g> elements
#     --create-groups              create <g> elements for runs of elements with
#                                  identical attributes
#     --keep-editor-data           won't remove Inkscape, Sodipodi, Adobe
#                                  Illustrator or Sketch elements and attributes
#     --keep-unreferenced-defs     won't remove elements within the defs
#                                  container that are unreferenced
#     --renderer-workaround        work around various renderer bugs (currently
#                                  only librsvg) (default)
#     --no-renderer-workaround     do not work around various renderer bugs
#                                  (currently only librsvg)

#   SVG document:
#     --strip-xml-prolog           won't output the XML prolog (<?xml ?>)
#     --remove-titles              remove <title> elements
#     --remove-descriptions        remove <desc> elements
#     --remove-metadata            remove <metadata> elements (which may contain
#                                  license/author information etc.)
#     --remove-descriptive-elements
#                                  remove <title>, <desc> and <metadata>
#                                  elements
#     --enable-comment-stripping   remove all comments (<!-- -->)
#     --disable-embed-rasters      won't embed rasters as base64-encoded data
#     --enable-viewboxing          changes document width/height to 100%/100%
#                                  and creates viewbox coordinates

#   Output formatting:
#     --indent=TYPE                indentation of the output: none, space, tab
#                                  (default: space)
#     --nindent=NUM                depth of the indentation, i.e. number of
#                                  spaces/tabs: (default: 1)
#     --no-line-breaks             do not create line breaks in output(also
#                                  disables indentation; might be overridden by
#                                  xml:space="preserve")
#     --strip-xml-space            strip the xml:space="preserve" attribute from
#                                  the root SVG element

#   ID attributes:
#     --enable-id-stripping        remove all unreferenced IDs
#     --shorten-ids                shorten all IDs to the least number of
#                                  letters possible
#     --shorten-ids-prefix=PREFIX  add custom prefix to shortened IDs
#     --protect-ids-noninkscape    don't remove IDs not ending with a digit
#     --protect-ids-list=LIST      don't remove IDs given in this comma-
#                                  separated list
#     --protect-ids-prefix=PREFIX  don't remove IDs starting with the given
#                                  prefix

#   SVG compatibility checks:
#     --error-on-flowtext          exit with error if the input SVG uses non-
#                                  standard flowing text (only warn by default)

PATH=/Users/dassi/Library/Python/2.7/bin


pushd ../web_root/images

$PATH/scour -i hexenweg.svg hexenweg_optimized.svg --disable-style-to-xml --disable-group-collapsing --remove-descriptive-elements --enable-comment-stripping --enable-viewboxing --indent=none --no-line-breaks --enable-id-stripping --protect-ids-noninkscape --protect-ids-prefix=Station_,Kreis_klein_,Kreis_gross,Pfad_zu_

popd
