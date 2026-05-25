import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "Beklenmedik bir hata oluştu.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || (error.status === 404 ? "Sayfa bulunamadı." : errorMessage);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#FAFAF5" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 text-center"
        style={{
          background: "#FFFEF5",
          border: "2px solid #6B6B5F",
          boxShadow: "8px 8px 0px rgba(107, 107, 95, 0.2)",
        }}
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-red-50 text-red-500 border-2 border-red-200">
            <AlertTriangle className="w-12 h-12" />
          </div>
        </div>

        <h1 className="typewriter text-2xl mb-2" style={{ color: "#2C2C28" }}>
          Eyvah! Bir Sorun Var
        </h1>
        <p className="handwritten mb-8" style={{ color: "#6B6B5F" }}>
          {errorStatus}: {errorMessage}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 py-3 typewriter transition-all hover:bg-[#2C2C28] hover:text-white"
            style={{ border: "1px solid #2C2C28", borderRadius: "2px" }}
          >
            <RefreshCw className="w-4 h-4" /> Sayfayı Yenile
          </button>
          
          <Link 
            to={localStorage.getItem("token") ? "/home" : "/"} 
            className="flex items-center justify-center gap-2 py-3 typewriter transition-all bg-[#2C2C28] text-white"
            style={{ borderRadius: "2px" }}
          >
            <Home className="w-4 h-4" /> Ana Sayfaya Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
