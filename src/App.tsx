import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Landing />
  </TooltipProvider>
);

export default App;
