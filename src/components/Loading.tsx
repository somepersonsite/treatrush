import { useEffect, useState } from "react";

const Loading = ({ onComplete }: { onComplete: () => void }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm">
      <div className="text-center">
        {/* Spinning Cotton Candy */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Outer spin ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          
          {/* Middle spin ring */}
          <div className="absolute inset-3 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}></div>
          
          {/* Inner cotton candy icon */}
          <div className="absolute inset-0 flex items-center justify-center animate-bounce">
            <div className="text-6xl">🍭</div>
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2 text-2xl animate-pulse" style={{ animationDelay: "0s" }}>✨</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
          <div className="absolute top-1/2 -left-4 text-xl animate-pulse" style={{ animationDelay: "0.25s" }}>💫</div>
          <div className="absolute top-1/2 -right-4 text-xl animate-pulse" style={{ animationDelay: "0.75s" }}>💫</div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
            Treat Rush
          </h2>
          <p className="text-lg text-foreground/70 font-medium">
            Loading sweetness{dots}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
