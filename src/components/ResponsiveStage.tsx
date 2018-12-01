import React, { useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";

interface Props {
  children: React.ReactNode;
  className: string;
}

const ResponsiveStage = (props: Props) => {
  const [state, setState] = useState({ width: 0, height: 0 });

  const parentElement = useRef<HTMLDivElement>(null);
  useEffect(
    () => {
      const onResize = () => {
        if (!parentElement.current) {
          return;
        }

        const rect = parentElement.current.getBoundingClientRect();
        setState({ height: rect.height, width: rect.width });
      };

      onResize();

      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    [parentElement]
  );

  return (
    <div
      style={{ overflow: "hidden" }}
      className={props.className}
      ref={parentElement}
    >
      <Stage width={state.width} height={state.height}>
        {props.children}
      </Stage>
    </div>
  );
};

export default ResponsiveStage;
