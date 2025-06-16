import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function FooterPage() {
  return (
    <footer className="bg-joinly_blue-light text-center border-t py-6 px-4">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center gap-y-6 md:flex-row md:justify-between md:gap-y-0">
        {/* Texte du copyright */}
        <Typography
          color="blue-gray"
          className="font-normal text-white text-sm md:text-base"
        >
          &copy; 2024 Joinly
        </Typography>

        {/* Liens de navigation */}
        <ul className="flex flex-wrap justify-center gap-4 md:gap-x-8">
          {[
            { to: "/about", label: "À propos" },
            { to: "/legal", label: "Mentions légales" },
            { to: "/privacy", label: "Politique de confidentialité" },
            { to: "/terms", label: "CGU" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="font-normal text-white text-sm md:text-base hover:text-joinly_blue-contraste transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
