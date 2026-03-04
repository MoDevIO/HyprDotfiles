import { Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"

const time = createPoll("", 1000, "date '+%H:%M:%S'")
const dateStr = createPoll("", 60000, "date '+%a %b %d'")

export default function Clock() {
  return (
    <box halign={Gtk.Align.START} spacing={8}>
      <label
        cssClasses={["clock"]}
        label={time}
        $={(self) => {
          let animating = false
          self.connect("notify::label", () => {
            if (animating) return
            animating = true
            // Smooth sine pulse: gently dims then brightens
            const duration = 500
            const fps = 60
            const stepTime = 1000 / fps
            const totalSteps = Math.ceil(duration / stepTime)
            let step = 0
            const timer = setInterval(() => {
              step++
              const t = Math.min(step / totalSteps, 1)
              // Sine pulse: 1.0 → 0.65 → 1.0
              self.opacity = 1 - 0.35 * Math.sin(t * Math.PI)
              if (t >= 1) {
                clearInterval(timer)
                animating = false
              }
            }, stepTime)
          })
        }}
      />
      <menubutton
        cssClasses={["date-btn"]}
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
      >
        <label cssClasses={["date"]} label={dateStr} />
        <popover cssClasses={["calendar-popover"]}>
          <Gtk.Calendar />
        </popover>
      </menubutton>
    </box>
  )
}
