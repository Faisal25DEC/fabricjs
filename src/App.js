import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { fabric } from "fabric";
import "./App.css";

function App() {
  const [isPlaying, setisPlaying] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [video, setvideo] = useState(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );

  const [w, setWidth] = useState(window.innerWidth);

  const videoTagRef = useRef();
  const videoRef = useRef();
  const fabricCanvasRef = useRef();

  const faceDetectCanvas = useRef();

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    const vidURL = URL.createObjectURL(file);
    videoRef.current.src = vidURL;
    videoTagRef.current.load();
    videoTagRef.current.play();
    setisPlaying(true);
  };

  const loadFaceApiModels = async () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ])
      .then(() => {
        setIsLoading(false);
        setIsModelLoaded(true);
      })
      .catch((er) => {
        console.error(er);
      });
  };

  const handlePlay = () => {
    if (!isPlaying) {
      videoTagRef.current.play();
      setisPlaying(true);
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      videoTagRef.current.pause();
      setisPlaying(false);
    }
  };

  const detectFaces = () => {
    const id = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          "fabric-vdo-canvas",
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions();

      faceDetectCanvas.current.innerHTML = faceapi.createCanvasFromMedia(
        videoTagRef.current
      );

      faceapi.matchDimensions(faceDetectCanvas.current, {
        width: w,
        height: (w * 9) / 16,
      });

      const resized = faceapi.resizeResults(detections, {
        width: w,
        height: (w * 9) / 16,
      });

      faceapi.draw.drawDetections(faceDetectCanvas.current, resized);
    }, 100);

    return id;
  };

  useEffect(() => {
    const windowResize = (e) => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", windowResize);

    loadFaceApiModels();

    return () => {
      window.removeEventListener("resize", windowResize);
    };
  }, []);

  useEffect(() => {
    const canvas = new fabric.Canvas(fabricCanvasRef.current, {});

    const video = new fabric.Image(videoTagRef.current, {
      left: 10,
      top: 10,

      objectCaching: false,
      selectable: true,
      evented: true,
    });

    canvas.add(video);
    canvas.bringToFront(video);

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });

    const id = detectFaces();

    return () => {
      clearInterval(id);
      canvas.dispose();
      videoTagRef.current.pause();
    };
  }, [video, w]);

  return (
    <>
      {isLoading ? (
        <div className=" w-[100%] h-[50vh] flex items-center justify-center">
          <img
            src="https://img.freepik.com/premium-vector/processing-icon-circular-loader-loading-progress-indicator-isolated-white-background_543062-380.jpg?w=2000"
            className="w-[100px] h-[100px]"
          />
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-2 items-center m-5">
        {isModelLoaded ? (
          <div className="flex items-center justify-center w-[90%] ">
            <label
              htmlFor="file-upload"
              className="py-2 px-4 bg-neutral-600 rounded-[30px] flex gap-2 text-white"
            >
              click here to upload video
              <input
                id="file-upload"
                className="hidden"
                type="file"
                accept="video/mp4"
                onChange={handleInputChange}
              />
            </label>
          </div>
        ) : (
          <></>
        )}

        {videoTagRef.current ? (
          <>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                disabled={isPlaying}
                className="disabled:bg-neutral-300 disabled:cursor-not-allowed h-12 w-12 rounded-full bg-blue-500 text-white font-medium  hover:bg-blue-400"
                onClick={handlePlay}
              >
                Play
              </button>
              <button
                disabled={!isPlaying}
                className="disabled:bg-neutral-300 disabled:cursor-not-allowed h-12 w-12 rounded-full bg-blue-500 text-white font-medium  hover:bg-blue-400"
                onClick={handlePause}
              >
                Pause
              </button>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="flex flex-col gap-2 items-center m-5 relative">
          <video
            width={w}
            height={(w * 9) / 16}
            crossOrigin="anonymous"
            ref={videoTagRef}
            id="video1"
            className="hidden rouned object-contain"
            autoPlay={true}
            loop={false}
            muted
          >
            <source className="w-full h-full" ref={videoRef} src={video} />
          </video>
          <canvas
            width={w}
            height={(w * 9) / 16}
            ref={fabricCanvasRef}
            id="fabric-vdo-canvas"
            className="border"
          />
          <canvas ref={faceDetectCanvas} id="canvas1" className="absolute" />
        </div>
      </div>
    </>
  );
}

export default App;
