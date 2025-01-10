interface CircularProgressProps {
  value: number;
  className?: string;
  gradient?: {
    startColor: string;
    endColor: string;
  };
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  className,
  gradient,
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(Math.max(value, 0), 100);
  const dashOffset = circumference - (progressValue / 100) * circumference;

  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-current stroke-[5] opacity-10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-[5]"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
            stroke: gradient ? `url(#gradient-${value})` : "currentColor",
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
        {gradient && (
          <defs>
            <linearGradient
              id={`gradient-${value}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradient.startColor} />
              <stop offset="100%" stopColor={gradient.endColor} />
            </linearGradient>
          </defs>
        )}
      </svg>
    </div>
  );
};
