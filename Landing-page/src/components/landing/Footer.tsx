const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-light text-muted-foreground">
          © {new Date().getFullYear()} Visora. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
