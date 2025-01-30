import AuthButtons from "../auth_components/AuthButtons";
import BG from "../assets/thomas-kinto-map-unsplash.jpg";

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${BG})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Routopia
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-8">
            Optimize your routes, visualize directions, and generate PDFs all in
            one place.
          </p>

          <AuthButtons />
        </div>

        <div className="absolute bottom-2 right-2 text-xs text-white z-20 bg-black bg-opacity-40 px-2 py-1 rounded">
          Photo by{" "}
          <a
            href="https://unsplash.com/photos/road-map-6MsMKWzJWKc"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Thomas Kinto
          </a>{" "}
          on Unsplash
        </div>
      </div>
    </div>
  );
};

export default Landing;
