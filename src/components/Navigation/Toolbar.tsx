import { Toolbar as MuiToolbar, IconButton, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";

// import Image from "mui-image";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ToolbarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

export default function Toolbar({ open, handleDrawerOpen }: ToolbarProps) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <MuiToolbar color="transparent">
      {!isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <Menu />
        </IconButton>
      )}
      {/* <Image src="/AppIcon.png" width={50} /> */}
      <Typography variant="h6" noWrap component="div" sx={{ color: "black" }}>
        {process.env.REACT_APP_TITLE}
      </Typography>
    </MuiToolbar>
  );
}
