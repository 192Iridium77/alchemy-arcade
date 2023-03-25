import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const NavButton = styled.button`
  width: 64px;
  height: 64px;
  transition: all 0.2s ease-in-out;
  :hover {
    background-color: #f5f7f9;
  }
`;

const MenuIcon = styled.img`
  padding: 12px;
`;

export default function MenuItems({ className }: any) {
  const navigate = useNavigate();

  const navigateToScratchList = () => {
    navigate("/scratch");
  };

  const navigateToSnesList = () => {
    navigate("/snes");
  };

  return (
    <MenuItemsContainer className={className}>
      <NavButton onClick={navigateToScratchList}>
        <MenuIcon
          src="/scratchLogo.png"
          style={{ width: 40 }}
          alt="Scratch Logo"
        />
      </NavButton>
      <NavButton onClick={navigateToSnesList}>
        <MenuIcon
          src="/snes.webp"
          style={{ width: 40, height: 40 }}
          alt="Snes Icon"
        />
      </NavButton>
    </MenuItemsContainer>
  );
}
