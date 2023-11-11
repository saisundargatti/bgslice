/* eslint-disable react/prop-types */
import DownloadButton from "../DownloadButton/DownloadImageButton";
import "./ProcessedImageDisplay.css"; // Import a CSS file for styling
import { PiTimerFill } from "react-icons/pi";
import { useState, useEffect } from "react";

function ProcessedImageDisplay({ processedImage, imageURL, selectedFile }) {
  const [seconds, setSeconds] = useState(600);
  // Use the useEffect hook to update the timer
  useEffect(() => {
    let interval = null;
    if (processedImage) {
      // If the timer is active, decrement the seconds every 1000 milliseconds
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!processedImage && seconds !== 0) {
      // If the timer is not active and seconds is not zero, clear the interval
      clearInterval(interval);
    }
    // Return a cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [seconds, processedImage]); // Pass isActive and seconds as dependencies
  // Define a function to format the seconds into mm:ss
  function formatTime() {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);

    return `${getMinutes} : ${getSeconds}`;
  }

  return (
    <div className="image-card-container">
      <div className="image-card">
        {processedImage && (
          <>
            <div className="original">
              <p className="card-title">Original Image</p>
              {imageURL && <img src={imageURL} alt="Original Image" />}
              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Original Image"
                />
              )}
              <div className="timer">
                <p>Reload to Clear or Will be Cleared in 10 minutes</p>
                <div className="time">
                  <PiTimerFill />
                  <p>{formatTime()}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="card-title">Processed Image</p>
              <div className="processed-img-container">
                <img
                  src={`data:image/png;base64,${processedImage}`}
                  alt="Processed Image"
                />
              </div>
              <div className="f-props">
                <DownloadButton
                  selectedFile={selectedFile}
                  imageUrl={imageURL}
                  processedImage={processedImage}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProcessedImageDisplay;
