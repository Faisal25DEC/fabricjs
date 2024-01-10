import React from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
const VideoButtons = ({ props }) => {
  const {
    videoResource,
    isPlaying,
    handlePlayPause,
    setVideoResource,

    onVideoUpload,
  } = props;
  return (
    <div>
      {videoResource && (
        <div className="w-[100%] lg:w-[100%] border text-[2rem] py-1 px-2 rounded-xl my-[1rem] flex gap-3 items-center">
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <div className="flex items-center gap-5">
                <IoMdPause />
                <p>Pause Video</p>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <FaPlay />
                <p>Play Video</p>
              </div>
            )}
          </button>
        </div>
      )}
      {videoResource ? (
        <div className="flex gap-4">
          <button
            className="w-[100%] bg-teal-400 text-white font-bold py-2 px-2 rounded-xl"
            onClick={() => {
              setVideoResource("");
              window.location.reload();
            }}
          >
            Delete Video
          </button>
        </div>
      ) : (
        <div>
          <label
            for="file-upload"
            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span>
              Upload a Video file{" "}
              <span className="text-red-300">
                Try to upload a youtube video for better experience
              </span>{" "}
            </span>
          </label>
          <input
            onChange={onVideoUpload}
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
          />
        </div>
      )}
    </div>
  );
};

export default VideoButtons;
