import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import "../../styles/components/Loader.css"

const LoaderCom = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateLoader = async () => {
      animate(
        [
          [".innerO", { pathLength: 1.1, pathOffset: 0 }],
          [".innerO", { pathLength: 0, pathOffset: 0 }]
        ],
        { duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }
      );
      animate(
        [
          [".outerO", { pathLength: 1.1, pathOffset: 0 }],
          [".outerO", { pathLength: 0, pathOffset: 0 }]
        ],
        { duration: 2, repeat: Infinity, repeatDelay: 0.6 }
      );
    };
    animateLoader();
  }, []);

  return (
    <div className="parent-loader" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#374650', // Optional: semi-transparent background
      zIndex: 1000
    }}>
      <svg
        ref={scope}
        width="200px"  // Adjusted for better visibility
        height="200px" // Adjusted for better visibility
        viewBox="0 0 93.033241 29.361316"
        style={{
          display: 'block',
          margin: '0 auto'
        }}
      >
        <motion.path
          className="innerO"
          initial={{ pathLength: 1.1, pathOffset: 1 }}
          style={{ rotate: -90 }}
          d="m 70.884863,14.506375 q 0,4.090915 2.68661,6.727635 2.671,2.63674 6.16987,2.63674 3.79561,0 6.40412,-2.68469 2.60851,-2.71661 2.60851,-6.615766 0,-3.947096 -2.57725,-6.6157808 -2.56168,-2.6846671 -6.34167,-2.6846671 -3.76439,0 -6.35729,2.6846671 -2.5929,2.6527048 -2.5929,6.5518618 z"
          stroke="#f1f2ee" // Added stroke color
          strokeWidth="1" // Added stroke width
          fill="none" // Ensure path is not filled
        />
        <motion.path
          className="outerO"
          initial={{ pathLength: 1.1, pathOffset: 1 }}
          style={{ rotate: 90 }}
          d="m 67.214223,14.458425 q 0,-5.2095278 3.73313,-8.9488859 3.71754,-3.739355 8.93457,-3.739355 5.15454,0 8.84083,3.771317 3.7019,3.7713141 3.7019,9.0607469 0,5.321382 -3.71752,9.028772 -3.73315,3.7234 -9.01266,3.7234 -4.67035,0 -8.38787,-3.3079 -4.09238,-3.65944 -4.09238,-9.588095 z"
          stroke="#f1f2ee" // Added stroke color
          strokeWidth="1" // Added stroke width
          fill="none" // Ensure path is not filled
        />
      </svg>
    </div>
  );
}

export default LoaderCom;