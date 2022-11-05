import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import data from "../data";
import { useParams } from "react-router-dom";

export default function Game() {
  const { gameId } = useParams();
  const [game, setGame] = useState();

  useEffect(() => {
    setGame(data.games.find((game) => game.id === gameId));
  }, [gameId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        height: "100%",
        width: "100%",
        p: 4,
      }}
    >
      {game ? (
        <iframe
          title={game.title}
          src={`https://scratch.mit.edu/projects/${game.scratchId}/embed`}
          height="100%"
          width="100%"
          allowtransparency="true"
          frameborder="0"
          scrolling="no"
          allowfullscreen
          style={{ maxWidth: "812px" }}
        />
      ) : (
        <div>404 game not found</div>
      )}
    </Box>
  );
}
