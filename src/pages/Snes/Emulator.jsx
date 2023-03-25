import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Icon } from "alchemy-tech-ui";
import data from "./data";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import styled from "styled-components";
import { generateConfig } from "./config";

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
  opacity: 0;
  padding-top: 30px;
  transition: opacity 0.5s ease-in-out;
  :hover {
    opacity: 1;
  }
`;

const EmulatorOutput = styled.div`
  background-color: black;
  color: lime;
  padding: 8px;
  overflow: auto;
  width: 100%;
  position: absolute;
  height: 200px;
  bottom: 0;
  white-space: pre-wrap;
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

export default function Emulator() {
  const { gameId } = useParams();

  const [game, setGame] = useState();
  const [pollTimer, setPollTimer] = useState();
  const [loading, setLoading] = useState("loading"); //typeme
  const [progress, setProgress] = useState(0); //typeme
  const [emulatorOutput, setEmulatorOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const initFromData = useCallback((data, name) => {
    setLoading("loading");
    console.log("initFromData");
    const dataView = new Uint8Array(data);

    window.Module.FS_createDataFile("/", name, dataView, true, true);
    window.Module.FS_createFolder("/", "save", true, true);
    window.Module.FS_createFolder("/", "save/files", true, true);
    window.Module.FS_createFolder("/", "save/states", true, true);
    window.Module.FS_createFolder("/", "etc", true, true);
    window.Module.FS_createDataFile(
      "/etc",
      "retroarch.cfg",
      generateConfig(),
      true,
      true
    );
    window.Module["callMain"](window.Module["arguments"]);

    setLoading("");
  }, []);

  const runEmulator = useCallback(
    (gameData) => {
      console.log("run emulator polling?");
      // todo track internal initialisation and remove polling
      const timer = setInterval(() => {
        if (window.Module?.FS_createDataFile) {
          console.log("poll emulator!");
          initFromData(gameData, game.filename);
        }
      }, 50);

      setPollTimer(timer);
    },
    [initFromData, game]
  );

  useEffect(() => {
    console.log("find game");
    setGame(
      data.find((gameData) => {
        return gameData.id === gameId;
      })
    );
  }, [gameId]);

  useEffect(() => {
    if (game) {
      console.log("start emulator");
      setLoading("loading");

      window.Module = {
        noInitialRun: true,
        arguments: ["-v", `/${game.filename}`], // libretro cli args, add '--help' to the array for more info
        // arguments: ["-v", "--menu"], // libretro cli args, add '--help' to the array for more info
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
            "🚀 ~ file: Game.jsx:134 ~ useEffect ~ expected:",
            expected
          );
          console.log(
            "🚀 ~ file: Game.jsx:110 ~ useEffect ~ remaining:",
            remaining
          );

          setProgress(((expected - remaining) / expected) * 100);
        },
        setStatus: function (text) {
          console.log("🚀 ~ file: Game.jsx:108 ~ useEffect ~ text:", text);
          setLoading(text);
          if (window.Module.setStatus.interval)
            clearInterval(this.setStatus.interval); // why is this here????
        },
        totalDependencies: 0,
        monitorRunDependencies: function (remaining) {
          console.log(
            "🚀 ~ file: Emulator.jsx:167 ~ useEffect ~ remaining:",
            remaining
          );
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

      (async () => {
        const response = await fetch(`/${game.filename}`, {
          responseType: "arraybuffer",
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file: ${response.status} ${response.statusText}`
          );
        }

        const blob = await response.blob();

        const rawData = await blob.arrayBuffer();

        // wait until this point here to bring in the script, then wait for the script to load.
        setTimeout(() => {
          setIsSetupComplete(true);
          runEmulator(rawData);
        }, 1000);
      })();

      return () => {
        try {
          window.exit("Game Closed");
        } catch (err) {
          console.log(err.message);
        }
      };
    }
  }, [runEmulator, game]);

  useEffect(() => {
    if (!loading) {
      console.log("terminating polling");
      clearInterval(pollTimer);
    }
  }, [loading, pollTimer]);

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      window.Module.resumeMainLoop();
    } else {
      window.Module.pauseMainLoop();
    }
  };

  return (
    <GameContainer>
      {game ? (
        <>
          {isSetupComplete ? (
            <Helmet>
              <script src="/snes9x.js" type="text/javascript" />
            </Helmet>
          ) : null}
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
              {loading ? null : (
                <CanvasControls>
                  <ButtonGroup>
                    <Icon
                      type={isPaused ? "Play" : "Pause"}
                      color="white"
                      onClick={handlePlayPause}
                    />

                    <Icon
                      type="CommandLine"
                      onClick={() => setShowOutput(!showOutput)}
                      color="white"
                    />
                    <Icon
                      type="Expand"
                      onClick={() =>
                        window.Module.requestFullScreen(true, true)
                      }
                      color="white"
                    />
                  </ButtonGroup>
                </CanvasControls>
              )}
            </CanvasContainer>
          </div>
        </>
      ) : (
        <div>404 not found</div>
      )}
    </GameContainer>
  );
}
