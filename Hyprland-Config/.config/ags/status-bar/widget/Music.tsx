import { createPoll } from "ags/time"
import { Gtk, Gdk } from "ags/gtk4"
import { exec } from "ags/process"

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
    <box
      spacing={0}
      valign={Gtk.Align.CENTER}
      $={(self) => {
        const hover = new Gtk.EventControllerMotion()
        let rev: Gtk.Revealer | null = null

        const findRevealer = () => {
          if (rev) return rev
          let child = self.get_first_child()
          while (child) {
            if (child instanceof Gtk.Revealer) {
              rev = child as Gtk.Revealer
              return rev
            }
            child = child.get_next_sibling()
          }
          return null
        }

        hover.connect("enter", () => {
          const r = findRevealer()
          if (r) r.revealChild = true
        })
        hover.connect("leave", () => {
          const r = findRevealer()
          if (r) r.revealChild = false
        })
        self.add_controller(hover)
      }}
    >
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
      <revealer
        revealChild={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        transitionDuration={250}
        visible={musicInfo((m) => m.length > 0)}
      >
        <box spacing={2} cssClasses={["music-controls"]}>
          <button
            cssClasses={["music-btn"]}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
              try {
                exec(["playerctl", "previous"])
              } catch {}
            }}
          >
            <label label="⏮" />
          </button>
          <button
            cssClasses={["music-btn"]}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
              try {
                exec(["playerctl", "play-pause"])
              } catch {}
            }}
          >
            <label label="⏯" />
          </button>
          <button
            cssClasses={["music-btn"]}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
              try {
                exec(["playerctl", "next"])
              } catch {}
            }}
          >
            <label label="⏭" />
          </button>
        </box>
      </revealer>
    </box>
  )
}
