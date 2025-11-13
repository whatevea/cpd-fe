export default function BrainStormingIcon({
  className,
  width = "32px",
  height = "32px",
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "transparent", width, height }}
      className={className}
    >
      {/* Brain Emoji */}
      <text
        x="50%"
        y="50%"
        fontFamily="Arial"
        fontSize="50"
        fill="#4a90e2"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        🧠
      </text>

      {/* Lightning Bolts positioned around the brain */}
      {[
        { x: "30%", y: "30%", size: 22 }, // Top-left
        { x: "70%", y: "30%", size: 28 }, // Top-right
        { x: "30%", y: "70%", size: 24 }, // Bottom-left
        { x: "70%", y: "70%", size: 20 }, // Bottom-right
      ].map((pos, index) => (
        <text
          key={index}
          x={pos.x}
          y={pos.y}
          fontFamily="Arial"
          fontSize={pos.size}
          fill="#FFD700"
          textAnchor="middle"
          opacity="0"
          stroke="#FFA500"
          strokeWidth="2"
        >
          ⚡
          <animate
            attributeName="opacity"
            values="0;1;0"
            keyTimes="0;0.5;1"
            dur={`${1 + index * 0.2}s`}
            repeatCount="indefinite"
            begin={`${index * 0.3}s`}
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 2,-5; 0,0"
            dur="4s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.4;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </text>
      ))}

      {/* Central flashing lightning */}
      <text
        x="50%"
        y="50%"
        fontFamily="Arial"
        fontSize="32"
        fill="#FFEE58"
        textAnchor="middle"
        opacity="0"
        stroke="#FFA000"
        strokeWidth="1.5"
      >
        ⚡
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.2s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-8; 0,0"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </text>
    </svg>
  );
}
