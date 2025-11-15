import PillNav from './PillNav';

// Example usage of PillNav component
const PillNavExample = () => {
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <PillNav
      logo="/placeholder.svg"
      logoAlt="Visora Logo"
      items={navItems}
      activeHref="#home"
      baseColor="#ffffff"
      pillColor="#060010"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#060010"
      ease="power3.easeOut"
      initialLoadAnimation={true}
    />
  );
};

export default PillNavExample;
