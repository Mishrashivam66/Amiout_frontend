import campusJourney from "../../../../../assets/campus-journey.webp";

const HeroBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#030b1e]" />

      {/* Desktop campus image */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: `url(${campusJourney})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "auto 100%",
        }}
      />

      {/* Dark fade on the left for readable text */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#030b1e] via-[#030b1e]/90 via-25% to-transparent lg:block" />

      {/* Mobile background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 lg:hidden"
        style={{
          backgroundImage: `url(${campusJourney})`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030b1e] to-transparent" />
    </div>
  );
};

export default HeroBackground;
