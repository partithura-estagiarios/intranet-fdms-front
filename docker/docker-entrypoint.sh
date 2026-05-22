#!/bin/sh

set -e
set -u

OPTIND=1

ROOT_HTML=/usr/share/nginx/html/
lightgray='\e[0;37m'
ACTION=$1

banner () {
  echo -e "${lightgray}"; figlet "PARTITHURA LOCAL FRONTEND";
  printf "\n@> Starting web server...\n"
 }

setup () {
  VITE_APP_ENDPOINT=${VITE_APP_ENDPOINT:-${VITE_GRAPHQL_API_URL:-}}
  VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES=${VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES:-${VITE_DATASOURCE:-}}
  LAYOUT=${LAYOUT:-CIRON}

  escape_js_string() {
    printf "%s" "$1" | sed "s/\\\\/\\\\\\\\/g; s/'/\\\\'/g"
  }

  APP_ENDPOINT_ESCAPED=$(escape_js_string "$VITE_APP_ENDPOINT")
  DATA_SOURCE_ESCAPED=$(escape_js_string "$VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES")
  LAYOUT_ESCAPED=$(escape_js_string "$LAYOUT")

  cat > /usr/share/caddy/env.js <<EOF
window.__APP_CONFIG__ = {
  VITE_APP_ENDPOINT: '$APP_ENDPOINT_ESCAPED',
  VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES: '$DATA_SOURCE_ESCAPED',
  LAYOUT: '$LAYOUT_ESCAPED'
};
EOF

  echo -e "${VITE_APP_ENDPOINT}"
  echo -e "${VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES}"
  echo -e "${LAYOUT}"
}

httpMode () {
  setup && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
}

debugMode () {
  setup && nginx-debug -g 'daemon off;'
}

case $ACTION in
  http)
  banner && httpMode
  ;;
  debug)
  banner && \
    printf "\n-debug-"
    tree -a -h --du $ROOT_HTML && \
    printf "-debug-\n" && \
    debugMode
  ;;
  *)
  exec "$@"
  ;;
esac
