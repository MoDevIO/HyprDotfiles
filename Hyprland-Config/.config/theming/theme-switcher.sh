#!/bin/sh
THEMES_DIR="$HOME/.config/theming/themes"

chosen=$(ls -1 "$THEMES_DIR" | rofi -dmenu -p "Theme" -theme "$HOME/.config/rofi/launcher.rasi")

[ -n "$chosen" ] && "$HOME/.config/theming/reload-theme.sh" "$chosen"
