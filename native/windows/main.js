const { app, BrowserWindow } = require("electron");

function create() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#14171a",
    title: "Lincoln Tech HVAC Allstars",
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  const local = require("path").join(__dirname, "..", "..", "index.html");
  const fs = require("fs");
  if (fs.existsSync(local)) win.loadFile(local);
  else win.loadURL("https://andrewhubbard215-eng.github.io/");
}

app.whenReady().then(create);
app.on("window-all-closed", () => app.quit());
