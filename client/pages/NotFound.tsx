import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#001F3F_0%,#003366_100%)]" />
      <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
        <h1 className="text-5xl font-extrabold mb-3">404</h1>
        <p className="text-white/80 mb-6">Seite nicht gefunden</p>
        <Link to="/" className="inline-block rounded-full bg-white/10 border border-white/20 px-6 py-3 hover:bg-white/20 transition">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
