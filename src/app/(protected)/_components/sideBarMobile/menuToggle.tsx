import * as React from "react";
import { motion } from "framer-motion";

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button onClick={toggle} className="flex text-gray-500 hover:text-gray-700">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <Path
        variants={{
          closed: { d: "M3 12h18" },
          open: { d: "M6 18L18 6" },
        }}
      />
      <Path
        variants={{
          closed: { d: "M3 6h18" },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M3 18h18" },
          open: { d: "M6 6l12 12" },
        }}
      />
    </svg>
  </button>
);
