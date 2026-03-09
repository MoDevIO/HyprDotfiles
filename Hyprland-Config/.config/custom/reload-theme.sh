#!/bin/sh
# source the palette
[ -f "$HOME/.config/custom/theme1.sh" ] && . "$HOME/.config/custom/theme1.sh"

# Build list of THEME_COLOR_* vars for selective envsubst (avoids clobbering SCSS $vars)
THEME_VARS=$(env | grep -o '^THEME_COLOR_[A-Za-z0-9_]*' | sed 's/^/$/g' | tr '\n' ' ')

# Kitty
envsubst < "$HOME/.config/kitty/kitty.conf.template" \
        > "$HOME/.config/kitty/kitty.conf"
for s in /tmp/mykitty.socket-*; do kitty @ --to="unix:$s" load-config 2>/dev/null; done

# AGS status bar
envsubst "$THEME_VARS" < "$HOME/.config/ags/status-bar/style.scss.template" \
                       > "$HOME/.config/ags/status-bar/style.scss"
sass --no-source-map "$HOME/.config/ags/status-bar/style.scss" \
                     "$HOME/.config/ags/status-bar/style.css"
busctl --user call io.Astal.status-bar /io/Astal/Application io.Astal.Application Request as 1 reload-css



