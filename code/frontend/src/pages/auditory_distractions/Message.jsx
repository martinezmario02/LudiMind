import { useEffect } from "react";

export default function Message({ silence = 5000, volume = 0.7 }) {
  useEffect(() => {
    const sound = new Audio("/sounds/message.mp3");
    sound.volume = volume;

    let stop = false;

    const playLoop = async () => {
      while (!stop) {
        sound.currentTime = 0;
        await sound.play();
        await new Promise(res =>
          setTimeout(res, sound.duration ? sound.duration * 1000 : 1000)
        );
        await new Promise(res => setTimeout(res, silence));
      }
    };

    playLoop();

    return () => {
      stop = true;
      sound.pause();
    };
  }, [silence, volume]);

  return null;
}
