import app from "ags/gtk4/app"
import style from "./style.scss"
import { MainBar, SecondaryBar } from "./widget/Bar"
import GLib from "gi://GLib"

const STYLE_CSS = GLib.get_home_dir() + "/.config/ags/status-bar/style.css"

app.start({
  instanceName: "status-bar",
  css: style,
  requestHandler(args, response) {
    if (args.includes("reload-css")) {
      app.apply_css(STYLE_CSS, true)
      response("css reloaded")
    } else {
      response("unknown command")
    }
  },
  main() {
    MainBar()
    SecondaryBar()
  },
})
