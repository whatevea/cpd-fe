import { Suspense } from "react";
import Navbar from "@/app/components/common/Navbar";
import { LoadingWrapper } from "@/app/components/LoadingWrapper";
import { PuzzleHydrator } from "@/app/components/puzzle/PuzzleHydrator";
import { AppRoutes } from "./routes/AppRoutes";
import Footer from "./app/components/common/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#092327] text-white">
      <LoadingWrapper>
        <Navbar />
        <main className=" min-h-screen">
          <Suspense
            fallback={
              <div className="text-center text-white py-10">Loading…</div>
            }
          >
            <AppRoutes />
          </Suspense>
        </main>
      </LoadingWrapper>
      <PuzzleHydrator />
      <Footer />
    </div>
  );
}

export default App;
