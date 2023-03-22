import {
  Box,
  Typography,
  Card,
  ImageList,
  ImageListItem,
  CardContent,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import data from "./data";
import useMediaQuery from "@mui/material/useMediaQuery";

// TODO temporary data store

export default function Dashboard() {
  // TODO api and postgres to store games
  // TODO load games
  const navigate = useNavigate();
  const navToGame = (gameId) => {
    navigate(`/snes/game/${gameId}`);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box sx={{ mx: 4 }}>
      <div>
        <Typography
          variant="h5"
          sx={{ p: 1 }}
          style={{ marginLeft: "-2rem", marginRight: "-2rem" }}
        >
          SNES Games
        </Typography>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0 }}
          style={{ marginLeft: "-2rem", marginRight: "-2rem" }}
        >
          <ImageList sx={{ width: "100%" }} cols={isMobile ? 1 : 3}>
            {data.map((game) => (
              <ImageListItem key={game.img}>
                <Card
                  onClick={() => navToGame(game.id)}
                  sx={{ boxShadow: 3, m: 1, cursor: "pointer" }}
                >
                  <CardMedia component="img" image={game.img} alt={game.alt} />
                  <CardContent>
                    <Typography
                      sx={{ minHeight: "60px" }}
                      variant="body2"
                      className="pt-2"
                    >
                      {game.description}
                    </Typography>
                  </CardContent>
                  {game.author ? (
                    <CardHeader subheader={`by ${game.author}`}></CardHeader>
                  ) : null}
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </div>
    </Box>
  );
}
