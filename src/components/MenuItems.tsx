import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledMenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 16px;
  background-color: white;
`;

export default function MenuItems() {
  const navigate = useNavigate();

  const navigateToScratchList = () => {
    navigate("/scratch");
  };

  const navigateToSnesList = () => {
    navigate("/snes");
  };

  return (
    <StyledMenuItemsContainer className="dropshadow-md">
      <button onClick={navigateToScratchList}>
        <img src="/scratchLogo.png" style={{ width: 40 }} alt="Scratch Logo" />
      </button>
      <button onClick={navigateToSnesList}>
        <img
          src="/snes.webp"
          style={{ width: 40, height: 40 }}
          alt="Snes Icon"
        />
      </button>
    </StyledMenuItemsContainer>
  );
}
