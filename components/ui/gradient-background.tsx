import React from "react";
import clsx from "clsx";

type Variant = "primary" | "accent";
type Intensity = "light" | "medium" | "strong";

interface GradientBackgroundProps {
  variant?: Variant;
  intensity?: Intensity;
  className?: string;
  children?: React.ReactNode;
}

const variantMap: Record<Variant, string> = {
  primary: "from-blue-500 via-purple-500 to-pink-500",
  accent: "from-green-400 via-teal-500 to-blue-500",
};

const intensityMap: Record<Intensity, string> = {
  light: "opacity-20 blur-sm",
  medium: "opacity-40 blur-md",
  strong: "opacity-60 blur-lg",
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = "primary",
  intensity = "medium",
  className,
  children,
}) => {
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div
        className={clsx(
          "absolute inset-0 z-0 bg-gradient-to-br",
          variantMap[variant],
          intensityMap[intensity]
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
