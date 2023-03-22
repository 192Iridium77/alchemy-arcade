import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCallback } from "react";
// import data from "./data";
// import { useParams } from "react-router-dom";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { Helmet } from "react-helmet";

export default function Game() {
  const [pollTimer, setPollTimer] = useState();
  const [loading, setLoading] = useState(true);
  const [vsync, setVsync] = useState(false);
  const [audioLatency, setAudioLatency] = useState(96);

  const initFromData = useCallback(
    (data, name) => {
      const dataView = new Uint8Array(data);
      window.Module.FS_createDataFile("/", name, dataView, true, true);
      window.Module.FS_createFolder("/", "etc", true, true);
      let config = "input_player1_select = shift\n";
      let latency = parseInt(audioLatency, 10);
      if (isNaN(latency)) latency = 96;
      config += "audio_latency = " + latency + "\n";
      if (vsync) config += "video_vsync = true\n";
      else config += "video_vsync = false\n";
      window.Module.FS_createDataFile(
        "/etc",
        "retroarch.cfg",
        config,
        true,
        true
      );
      // document.getElementById("canvas_div").style.display = "block";
      window.Module["callMain"](window.Module["arguments"]);

      setLoading(false);
    },
    [vsync, audioLatency]
  );

  const runEmulator = useCallback(
    (gameData) => {
      if (gameData) {
        const timer = setInterval(() => {
          if (window.Module) {
            initFromData(gameData, "TheLegendOfZelda.smc");
          }
        }, 50);

        setPollTimer(timer);
      }
    },
    [initFromData]
  );

  useEffect(() => {
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

      runEmulator(rawData);
    })();
  }, [runEmulator]);
  //   const { gameId } = useParams();

  //   const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  //   useEffect(() => {
  //     setGame(data.find((game) => game.id === gameId));
  //   }, [gameId]);

  useEffect(() => {
    if (!loading) {
      clearInterval(pollTimer);
    }
  });

  const handleChangeVsync = () => {
    setVsync(!vsync);
  };
  const handleAudioLatency = (event) => {
    setAudioLatency(event.target.value);
  };

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
            onClick={() =>
              window.Module.requestFullScreen(
                document.getElementById("pointerLock").checked,
                document.getElementById("resize").checked
              )
            }
          />
          <br />
          <input
            id="vsync"
            type="checkbox"
            checked={vsync}
            disabled={!loading}
            onChange={handleChangeVsync}
          />
          <label htmlFor="vsync" style={{ color: !loading && "gray" }}>
            Enable V-sync (can only be done before loading game)
          </label>
          <br />
          <input
            type="textbox"
            id="latency"
            size="3"
            maxLength="3"
            value={audioLatency}
            onChange={handleAudioLatency}
            disabled={!loading}
          />
          <label
            htmlFor="latency"
            id="latency-label"
            style={{ color: !loading && "gray" }}
          >
            Audio latency (ms) (increase if you hear pops at fullspeed, can only
            be done before loading game)
          </label>
        </div>
        <textarea
          class="emscripten"
          id="output"
          rows="8"
          style={{ width: "100%" }}
        ></textarea>
      </div>
      <Helmet>
        <script src="/snes9x.js" type="text/javascript" />
      </Helmet>
    </Box>
  );
}
