import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Icon } from "alchemy-tech-ui";
// import data from "./data";
// import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import styled from "styled-components";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
  width: 100%;
`;

const CanvasContainer = styled.div`
  position: relative;
`;

const StyledCanvas = styled.canvas`
  background-color: black;
  display: block;
`;

const CanvasControls = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  opacity: 1;
  padding-top: 30px;
`;
//   transition: opacity 0.5s ease-in-out;
//   :hover {
//     opacity: 1;
//   }

const EmulatorOutput = styled.div`
  background-color: black;
  color: lime;
  padding: 8px;
  overflow: auto;
  width: 100%;
  position: absolute;
  height: 100px;
  bottom: 0;
`;

const LoadingDisplay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 8px;
  opacity: 0.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: end;
  padding: 16px;
  gap: 8px;
  opacity: 0.8;
`;

export default function Game() {
  const [pollTimer, setPollTimer] = useState();
  const [loading, setLoading] = useState("loading"); //typeme
  const [progress, setProgress] = useState(0); //typeme
  const [emulatorOutput, setEmulatorOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const initFromData = useCallback((data, name) => {
    const dataView = new Uint8Array(data);
    window.Module.FS_createDataFile("/", name, dataView, true, true);
    window.Module.FS_createFolder("/", "etc", true, true);
    let config = "input_player1_select = shift\n";
    config += "audio_latency = 96\n";
    config += "video_vsync = true\n";
    window.Module.FS_createDataFile(
      "/etc",
      "retroarch.cfg",
      config,
      true,
      true
    );
    window.Module["callMain"](window.Module["arguments"]);

    setLoading("");
  }, []);

  const runEmulator = useCallback(
    (gameData) => {
      // todo track internal initialisation and remove polling
      const timer = setInterval(() => {
        if (window.Module?.FS_createDataFile) {
          initFromData(gameData, "TheLegendOfZelda.smc");
        }
      }, 50);

      setPollTimer(timer);
    },
    [initFromData]
  );

  useEffect(() => {
    setLoading("initialising");

    window.Module = {
      noInitialRun: true, // sets shouldRunNow to false which will initialise, but not start the emulator. emulator can then probably start by calling Module.run() or doRun
      arguments: ["-v", "/TheLegendOfZelda.smc"], // libretro cli args, add '--help' to the array for more info
      preRun: [], // not sure how pre/post work yet, I think they are hooks that give access to internal variables at runtime
      postRun: [],
      print: (text) => {
        text = Array.prototype.slice.call(arguments).join(" "); // arguments is global??
        setEmulatorOutput((value) => {
          return `${value}${text}\n`;
        });
      },
      printErr: function (text) {
        // todo toast
        text = Array.prototype.slice.call(arguments).join(" ");
        setEmulatorOutput((value) => {
          return `${value}${text}\n`;
        });
      },
      canvas: document.getElementById("canvas"),
      setProgress: function (remaining, expected) {
        console.log(
          "🚀 ~ file: Game.jsx:110 ~ useEffect ~ remaining:",
          remaining
        );

        setProgress((expected - remaining) / expected);
      },
      setStatus: function (text) {
        console.log("🚀 ~ file: Game.jsx:108 ~ useEffect ~ text:", text);
        setLoading(text);
        if (window.Module.setStatus.interval)
          clearInterval(this.setStatus.interval); // why is this here????
      },
      totalDependencies: 0,
      monitorRunDependencies: function (remaining) {
        this.totalDependencies = Math.max(this.totalDependencies, remaining);

        if (remaining) {
          setProgress(
            this.totalDependencies - remaining / this.totalDependencies
          );
        } else {
          setLoading("complete");
        }
      },
    };
    window.Module.setStatus("downloading");

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
  }, [loading, pollTimer]);

  return (
    <GameContainer>
      <div style={{ marginTop: "12px" }}>
        <CanvasContainer>
          <StyledCanvas
            className="emscripten"
            id="canvas"
            onContextMenu={(event) => event.preventDefault()}
            width="800"
            height="600"
          />
          {showOutput ? (
            <EmulatorOutput>
              <div style={{ padding: "4px" }}>{emulatorOutput}</div>
            </EmulatorOutput>
          ) : null}
          <LoadingDisplay>
            <div style={{ color: "white" }}>{loading}</div>
            <progress max={1} value={progress} hidden={!loading} />
          </LoadingDisplay>
          <CanvasControls>
            <ButtonGroup>
              <Icon
                type="CommandLine"
                onClick={() => setShowOutput(!showOutput)}
                color="white"
              />
              <Icon
                type="Expand"
                onClick={() => window.Module.requestFullScreen(true, true)}
                color="white"
              />
            </ButtonGroup>
          </CanvasControls>
        </CanvasContainer>
      </div>
      <Helmet>
        <script src="/snes9x.js" type="text/javascript" />
      </Helmet>
    </GameContainer>
  );
}
