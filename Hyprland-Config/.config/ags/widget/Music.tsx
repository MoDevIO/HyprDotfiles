import { createPoll } from "ags/time"
import { Gtk } from "ags/gtk4"

const musicInfo = createPoll(
  "",
  2000,
  [
    "bash",
    "-c",
    "playerctl metadata --format '{{artist}} — {{title}}' 2>/dev/null || echo ''",
  ],
  (out) => {
    if (!out || out.includes("No players found")) return ""
    const clean = out
      .replace(/[^\p{L}\p{N}\s\-—–_.,:;!?'"()&/\\@#]/gu, "")
      .trim()
    if (!clean) return ""
    const track = clean.length > 40 ? clean.slice(0, 37) + "…" : clean
    return `${track}`
  },
)

export default function Music() {
  return (
    <box spacing={0} valign={Gtk.Align.CENTER}>
      {/* Separator between clock/date and music */}
      <box
        cssClasses={["bar-sep"]}
        valign={Gtk.Align.CENTER}
        visible={musicInfo((m) => m.length > 0)}
      />
      <label
        cssClasses={["music-label"]}
        label={musicInfo}
        visible={musicInfo((m) => m.length > 0)}
        $={(self) => {
          let animating = false
          self.connect("notify::label", () => {
            if (animating) return
            animating = true
            // Smooth pulse on track change
            const duration = 600
            const fps = 60
            const stepTime = 1000 / fps
            const totalSteps = Math.ceil(duration / stepTime)
            let step = 0
            const timer = setInterval(() => {
              step++
              const t = Math.min(step / totalSteps, 1)
              self.opacity = 1 - 0.4 * Math.sin(t * Math.PI)
              if (t >= 1) {
                clearInterval(timer)
                animating = false
              }
            }, stepTime)
          })
        }}
      />
    </box>
  )
}
