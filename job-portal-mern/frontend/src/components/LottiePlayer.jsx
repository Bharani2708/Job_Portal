import { useLottie } from "lottie-react";

export default function LottiePlayer({ 
  animationData, 
  loop = true, 
  autoplay = true, 
  style, 
  className 
}) {
  const options = {
    animationData,
    loop,
    autoplay
  };

  const { View } = useLottie(options, style);

  return <div className={className}>{View}</div>;
}

