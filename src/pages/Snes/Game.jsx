import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
// import data from "./data";
// import { useParams } from "react-router-dom";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { Helmet } from "react-helmet";

export default function Game() {
  const [gameData, setGameData] = useState();
  const [pollTimer, setPollTimer] = useState();
  const [loading, setLoading] = useState(true);

  const initFromData = useCallback((data, name) => {
    var dataView = new Uint8Array(data);
    window.Module.FS_createDataFile("/", name, dataView, true, true);
    window.Module.FS_createFolder("/", "etc", true, true);
    var config = "input_player1_select = shift\n";
    var latency = parseInt(document.getElementById("latency").value, 10);
    if (isNaN(latency)) latency = 96;
    config += "audio_latency = " + latency + "\n";
    if (document.getElementById("vsync").checked)
      config += "video_vsync = true\n";
    else config += "video_vsync = false\n";
    window.Module.FS_createDataFile(
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
    window.Module["callMain"](window.Module["arguments"]);

    setLoading(false);
  }, []);

  useEffect(() => {
    // snes9x = require("../../../public/snes9x.js");
    setLoading(true);
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

      const rawData = await blob.arrayBuffer();

      setGameData(rawData);
    })();
  }, []);
  //   const { gameId } = useParams();

  //   const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  //   useEffect(() => {
  //     setGame(data.find((game) => game.id === gameId));
  //   }, [gameId]);

  useEffect(() => {
    if (gameData) {
      const timer = setInterval(() => {
        if (window.Module) {
          initFromData(gameData, "TheLegendOfZelda.smc");
        }
      }, 50);

      setPollTimer(timer);
      console.log("initing");
    }
  }, [gameData, initFromData]);

  useEffect(() => {
    if (!loading) {
      clearInterval(pollTimer);
    }
  });

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
        <div className="emscripten" id="status"></div>
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
      <Helmet>
        <script src="/snes9x.js" type="text/javascript" />
      </Helmet>
    </Box>
  );
}
