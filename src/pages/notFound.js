import { useEffect } from "react";
import Header from "../components/Header";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found - Instagram";
  }, []);
  return (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <p className="text-center text-2xl">Page not Found</p>
      </div>
    </div>
  );
}
