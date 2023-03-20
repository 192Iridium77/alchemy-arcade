import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
// import data from "./data";
// import { useParams } from "react-router-dom";
// import useMediaQuery from "@mui/material/useMediaQuery";

let snes9x;

export default function Game() {
  const [fileCount, setFileCount] = useState(0);

  const initFromData = useCallback(
    (data, name) => {
      console.log("🚀 ~ file: snes9xNext.js:82 ~ initFromData ~ name:", name);
      console.log("🚀 ~ file: snes9xNext.js:82 ~ initFromData ~ data:", data);
      var dataView = new Uint8Array(data);
      snes9x.Module.FS_createDataFile("/", name, dataView, true, false);
      setFileCount((count) => count - 1);
      if (fileCount === 0) {
        snes9x.Module.FS_createFolder("/", "etc", true, true);
        var config = "input_player1_select = shift\n";
        var latency = parseInt(document.getElementById("latency").value, 10);
        if (isNaN(latency)) latency = 96;
        config += "audio_latency = " + latency + "\n";
        if (document.getElementById("vsync").checked)
          config += "video_vsync = true\n";
        else config += "video_vsync = false\n";
        snes9x.Module.FS_createDataFile(
          "/etc",
          "retroarch.cfg",
          config,
          true,
          true
        );
        document.getElementById("canvas_div").style.display = "block";
        document.getElementById("vsync").disabled = true;
        document.getElementById("vsync-label").style.color = "gray";
        document.getElementById("latency").disabled = true;
        document.getElementById("latency-label").style.color = "gray";
        console.log("Starting up");
        snes9x.Module["callMain"](snes9x.Module["arguments"]);
      }
    },
    [fileCount]
  );

  const runEmulator = useCallback(
    (file) => {
      // what happens if you initFromData more than once??
      const filereader = new FileReader();
      filereader.file_name = file.name;
      filereader.onload = function () {
        initFromData(this.result, this.file_name);
      };
      filereader.readAsArrayBuffer(file);
    },
    [initFromData]
  );

  useEffect(() => {
    snes9x = require("./snes9xNext");

    (async () => {
      const response = await fetch("/TheLegendOfZeldaALinkToThePast.smc", {
        responseType: "arraybuffer",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = () => {
        const rawData = reader.result;
        // Do something with the raw data
        runEmulator(rawData);
      };
      reader.readAsArrayBuffer(blob);

      //   console.log("🚀 ~ file: Game.jsx:75 ~ blob:", blob);

      //   const file = new File(blob, "thelegofzel");

      //   runEmulator(file);

      //   console.log("🚀 ~ file: Game.jsx:73 ~ blob:", blob);

      //   const reader = new FileReader();
      //   reader.onload = (event) => {
      //     const contents = event.target.result;
      //     console.log("🚀 ~ file: Game.jsx:78 ~ contents:", contents);
      //     // Do something with the file contents
      //     runEmulator(contents);
      //   };

      //   reader.readAsArrayBuffer(blob);
    })();
  }, [runEmulator]);
  //   const { gameId } = useParams();

  //   const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  //   useEffect(() => {
  //     setGame(data.find((game) => game.id === gameId));
  //   }, [gameId]);

  const handleFile = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        height: "100%",
        width: "100%",
        // p: isMobile ? 0 : 4,
      }}
    >
      <div style={{ marginTop: "12px" }}>
        <div>Currently needs the Rom file, update coming soon</div>
        <div className="emscripten" id="status"></div>
        <div class="emscripten emscripten_border" id="openrom">
          <input
            type="file"
            id="rom"
            name="upload"
            onChange={handleFile}
            multiple=""
            placeholder="select a rom"
          />
        </div>
        <div>
          <progress defaultValue="0" max="1" id="progress" hidden=""></progress>
        </div>
        <div id="canvas_div">
          <canvas
            className="emscripten"
            id="canvas"
            onContextMenu={(event) => event.preventDefault()}
            width="800"
            height="600"
            style={{ backgroundColor: "black" }}
          ></canvas>
        </div>

        <div className="emscripten">
          <input type="checkbox" id="resize" />
          <label htmlFor="resize">Resize canvas</label>
          <input type="checkbox" id="pointerLock" defaultChecked />
          <label htmlFor="pointerLock">Lock/hide mouse pointer</label>
          <input
            type="button"
            value="Fullscreen"
            // onClick={window.Module.requestFullScreen(
            //   document.getElementById("pointerLock").checked,
            //   document.getElementById("resize").checked
            // )}
          />
          <br />
          <input type="checkbox" id="vsync" disabled="" />
          <label htmlFor="vsync" id="vsync-label" style={{ color: "gray" }}>
            Enable V-sync (can only be done before loading game)
          </label>
          <br />
          <input
            type="textbox"
            id="latency"
            size="3"
            maxLength="3"
            value="96"
            disabled=""
          />
          <label htmlFor="latency" id="latency-label" style={{ color: "gray" }}>
            Audio latency (ms) (increase if you hear pops at fullspeed, can only
            be done before loading game)
          </label>
        </div>
        <textarea class="emscripten" id="output" rows="8"></textarea>
      </div>
    </Box>
  );
}
