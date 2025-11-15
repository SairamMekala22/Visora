import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/landing" className="text-2xl font-light tracking-tight hover:opacity-70 transition-smooth">
            Visora
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-light hover:text-charcoal transition-smooth">
              Home
            </a>
            <a href="#features" className="text-sm font-light hover:text-charcoal transition-smooth">
              Features
            </a>
            <a href="#reviews" className="text-sm font-light hover:text-charcoal transition-smooth">
              Reviews
            </a>
            <a href="#contact" className="text-sm font-light hover:text-charcoal transition-smooth">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
