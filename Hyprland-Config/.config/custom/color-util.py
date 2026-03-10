#!/usr/bin/env python3
"""Tiny color helper for theme scripts. Outputs bare hex (#RRGGBB).

Usage:
  color-util.py lighten '#1A1A1A' 20
  color-util.py darken  '#1A1A1A' 10
  color-util.py mix     '#1A1A1A' '#ffffff' 50
"""
import sys, colorsys

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def rgb_to_hex(r, g, b):
    return "#{:02x}{:02x}{:02x}".format(
        max(0, min(255, round(r * 255))),
        max(0, min(255, round(g * 255))),
        max(0, min(255, round(b * 255))),
    )

def lighten(hex_color, amount):
    h, l, s = colorsys.rgb_to_hls(*hex_to_rgb(hex_color))
    l = min(1.0, l + amount / 100.0)
    return rgb_to_hex(*colorsys.hls_to_rgb(h, l, s))

def darken(hex_color, amount):
    h, l, s = colorsys.rgb_to_hls(*hex_to_rgb(hex_color))
    l = max(0.0, l - amount / 100.0)
    return rgb_to_hex(*colorsys.hls_to_rgb(h, l, s))

def mix(c1, c2, weight):
    r1, g1, b1 = hex_to_rgb(c1)
    r2, g2, b2 = hex_to_rgb(c2)
    w = weight / 100.0
    return rgb_to_hex(r1 * (1 - w) + r2 * w, g1 * (1 - w) + g2 * w, b1 * (1 - w) + b2 * w)

cmd, *args = sys.argv[1:]
if cmd == "lighten":
    print(lighten(args[0], float(args[1])))
elif cmd == "darken":
    print(darken(args[0], float(args[1])))
elif cmd == "mix":
    print(mix(args[0], args[1], float(args[2])))
else:
    sys.exit(f"Unknown command: {cmd}")
