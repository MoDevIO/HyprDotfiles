import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Clock from "./Clock"
import Music from "./Music"
import Workspaces from "./Workspaces"
import SysInfo from "./SysInfo"

const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

// Monitor 1 (DP-1): workspaces 1–10
const M1_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Monitor 2 (HDMI-A-1): workspaces 11–20, displayed as 1–10
const M2_IDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

function monitorProps(connector: string, fallbackMonitor: number) {
  const gdkmonitor = app.monitors.find(
    (monitor) => monitor.get_connector() === connector,
  )

  if (gdkmonitor) {
    return { gdkmonitor }
  }

  console.warn(
    `[ags/bar] Monitor ${connector} not found, falling back to monitor index ${fallbackMonitor}.`,
  )

  return { monitor: fallbackMonitor }
}

export function MainBar() {
  return (
    <window
      visible
      {...monitorProps("DP-1", 1)}
      anchor={TOP | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      marginTop={10}
      marginBottom={0}
      cssClasses={["bar"]}
      application={app}
    >
      <centerbox
        startWidget={
          <box halign={Gtk.Align.START} cssClasses={["bar-island"]}>
            <Clock />
            <Music />
          </box>
        }
        centerWidget={
          <box cssClasses={["bar-island"]}>
            <Workspaces ids={M1_IDS} />
          </box>
        }
        endWidget={
          <box halign={Gtk.Align.END} cssClasses={["bar-island"]}>
            <SysInfo />
          </box>
        }
      />
    </window>
  )
}

export function SecondaryBar() {
  return (
    <window
      visible
      {...monitorProps("HDMI-A-1", 0)}
      anchor={TOP | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      marginTop={6}
      marginBottom={0}
      cssClasses={["bar"]}
      application={app}
    >
      <centerbox
        centerWidget={
          <box cssClasses={["bar-island"]}>
            <Workspaces ids={M2_IDS} displayOffset={10} />
          </box>
        }
      />
    </window>
  )
}
