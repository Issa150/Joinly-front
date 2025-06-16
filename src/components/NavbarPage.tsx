import EventSearchBar from "./event/EventSearchBar";
import {
  Button,
  Collapse,
  IconButton,
  Navbar,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavbarPage() {
  const [openNav, setOpenNav] = useState(false);
  const { firstname, profileImg, role, isAuthenticated, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (searchParams: string) => {
    console.log("handleSearch appelé avec :", searchParams);
    navigate(`/search?${searchParams}`);
  };

  useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Navbar className="opacity-100 border-0 sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-joinly_blue-light">
      <div className="flex items-center justify-between">
        {/* Logo et Barre de recherche */}
        <div className="flex items-center flex-grow gap-4">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="h-10 w-20" />
          </Link>
          <div className="hidden lg:block flex-grow max-w-2xl">
            <EventSearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Bouton de menu mobile */}
        <IconButton
          variant="text"
          color="white"
          onClick={() => setOpenNav(!openNav)}
          className="lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {openNav ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </IconButton>

        {/* Profil et Navigation (Affiché sur Desktop) */}
        <div className="hidden lg:flex items-center gap-x-4">
          {isAuthenticated ? (
            <Menu open={openMenu} handler={setOpenMenu}>
              <MenuHandler>
                <div
                  className="flex items-center cursor-pointer"
                  onMouseEnter={() => setOpenMenu(true)}
                  onMouseLeave={() => setOpenMenu(false)}
                >
                  <Typography variant="small" className="mr-2 text-white py-0 px-1 bg-red-300 rounded">{role}</Typography>
                  <Typography variant="small" className="mr-2 text-black">{firstname}</Typography>
                  <Avatar src={profileImg || "https://cdn.pixabay.com/photo/2013/07/13/10/44/man-157699_1280.png"} alt="profile" size="sm" />
                </div>
              </MenuHandler>
              <MenuList onMouseEnter={() => setOpenMenu(true)} onMouseLeave={() => setOpenMenu(false)}>
                <MenuItem onClick={() => navigate("/my_profile")}>Profil</MenuItem>
                {role === "ORGANIZER" && (
                  <>
                    <MenuItem onClick={() => navigate("/organizer")}>Gérer Les demandes</MenuItem>
                    <MenuItem onClick={() => navigate("/participant")}>Suivi des demandes</MenuItem>
                    <MenuItem onClick={() => navigate("/my-events")}>Mes événements</MenuItem>
                    <MenuItem onClick={() => navigate("/eventform")}>Créer un événement</MenuItem>
                  </>
                )}
                {role === "PARTICIPANT" && (
                  <MenuItem onClick={() => navigate("/participant")}>Suivi des demandes</MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Link to="signin">
                <Button variant="text" size="sm" className="text-white bg-joinly_blue-principale hover:bg-joinly_blue-contraste">
                  Connexion
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="text" size="sm" className="text-white bg-joinly_blue-principale hover:bg-joinly_blue-contraste">
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <Collapse open={openNav} className="lg:hidden">
        <div className="flex flex-col items-center w-full mt-4 gap-2 px-1">
          {isAuthenticated ? (
            <>
              {role === "ORGANIZER" && (
                <>
                  <Button onClick={() => navigate("/organizer")} className="w-full bg-transparent shadow-none hover:outline-blue-900 hover:outline hover:shadow-none">Gérer Les demandes</Button>
                  <Button onClick={() => navigate("/participant")} className="w-full bg-transparent shadow-none hover:outline-blue-900 hover:outline hover:shadow-none">Suivi des demandes</Button>
                  <Button onClick={() => navigate("/my-events")} className="w-full bg-transparent shadow-none hover:outline-blue-900 hover:outline hover:shadow-none">Mes événements</Button>
                  <Button onClick={() => navigate("/eventform")} className="w-full bg-transparent shadow-none hover:outline-blue-900 hover:outline hover:shadow-none">Créer un événement</Button>
                </>
              )}
              {role === "PARTICIPANT" && (
                <Button onClick={() => navigate("/participant")} className="w-full">Suivi des demandes</Button>
              )}
              <Button onClick={() => navigate("/my_profile")} className="text-white bg-joinly_blue-principale hover:bg-joinly_blue-contraste w-full">Profil</Button>
              <Button onClick={handleLogout} className="text-white bg-joinly_blue-principale hover:bg-joinly_blue-contraste w-full">Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="signin">
                <Button className="text-white bg-joinly_blue-principale hover:bg-joinly_blue-contraste w-full">Connexion</Button>
              </Link>
              <Link to="/signup">
                <Button className="text-white bg-joinly_blue-principale hover:bg-joinly_blue-contraste w-full">Inscription</Button>
              </Link>
            </>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}
