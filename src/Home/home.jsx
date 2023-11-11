import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProcessedImageDisplay from "../ProcessedImage/ProImgComp";
import Loader from "../Loader/loader";
import { BiSolidError } from "react-icons/bi";
import { AiOutlineUpload } from "react-icons/ai";
import About from "../About/about";
import ContactUs from "../Contact/contact";

// Hook to handle click events outside a specified element
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function Home() {
  const [imageURL, setImageURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isValidURL, setValidURL] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const popupRef = useRef(); // Ref for the popup

  useEffect(() => {
    let timer;
    if (processedImage !== undefined) {
      // Delay the start of the timer for 10 minutes
      timer = setTimeout(() => {
        // Reset thce states when the timer expires
        setImageURL("");
        setSelectedFile(null);
        setProcessedImage(null);
      }, 600000); // 10 minutes in milliseconds
    }

    return () => {
      // Clear the timer if the component unmounts or if processedImage becomes defined
      clearTimeout(timer);
    };
  }, [processedImage]);

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setError(null);
  };
  useOnClickOutside(popupRef, closePopup); // Hook to close popup when clicked outside

  const handleURLChange = (e) => {
    const url = e.target.value;
    const urlPattern = /^https?:\/\/.+/;
    const isValid = urlPattern.test(url);
    setValidURL(isValid);
    setImageURL(url);
  };

  const handleURLSubmit = () => {
    if (isValidURL && imageURL) {
      setIsLoading(true);
      setError(null);
      setSelectedFile(null);
      setProcessedImage(null);

      if (imageURL) {
        const formData = new FormData();
        formData.append("image_url", imageURL);

        const processImage = async () => {
          try {
            const response = await axios.post(
              "http://127.0.0.1:5000/uploadUrl",
              formData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.data.success) {
              setIsLoading(false);
              setProcessedImage(response.data.processed_image);
            } else {
              setIsLoading(false);
              setError(response.data.error);
              console.error(response.data.error);
            }
          } catch (error) {
            setIsLoading(false);
            setError("An error occurred while processing the image");
          }
        };

        processImage();
      }

      closePopup();
    } else {
      setIsLoading(false);
      closePopup();
    }
  };

  const clearURL = () => {
    setImageURL("");
    setValidURL(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      setImageURL("");
      setProcessedImage(null);

      const processImage = async () => {
        setIsLoading(true);
        setError(null); // Clear any previous errors

        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/process",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            setIsLoading(false);
            setProcessedImage(response.data.processed_image);
          } else {
            setIsLoading(false);
            setError(response.data.error);
          }
        } catch (error) {
          setIsLoading(false);
          setError("An error occurred while processing the image.");
          console.error(error);
        }
      };

      processImage();
    }
  }, [selectedFile, setProcessedImage]);

  const condition = imageURL || selectedFile;

  return (
    <>
      <section className="middle-section">
        {!processedImage && (
          <>
            <p className="bg-removal-text">
              You can upload an image to remove the background
            </p>
            <div className="upload-card">
              <label className="file-label">
                <div>
                  <AiOutlineUpload />
                </div>
                <p>Upload Image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </label>
              <div className="url-container">
                <p className="p-tag">or</p>
                <a onClick={openPopup} className="anchor-link">
                  Provide image url
                </a>
              </div>
            </div>
          </>
        )}
        {isPopupVisible && (
          <div className="popup-container">
            <div className="popup" ref={popupRef}>
              <input
                type="text"
                placeholder="Enter Image URL"
                value={imageURL}
                onChange={handleURLChange}
                className={isValidURL ? "" : "invalid"}
              />
              {!isValidURL && (
                <div className="flex-container">
                  <p>Invalid URL. Please enter a valid image URL.</p>
                  <button onClick={clearURL}>Clear</button>
                </div>
              )}
              {!imageURL && (
                <div>
                  <p style={{ color: "black", textAlign: "center" }}>
                    Provide Image Url...
                  </p>
                </div>
              )}
              {isValidURL && (
                <div className="d-props">
                  <button onClick={clearURL}>Clear</button>
                  <button onClick={handleURLSubmit}>Submit</button>
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && <Loader />}

        {error && (
          <div className="error-container">
            <div className="error-message">
              <BiSolidError size={25} />
              <p>{error}</p>
            </div>
          </div>
        )}

        {processedImage && !isPopupVisible && condition && (
          <ProcessedImageDisplay
            imageURL={imageURL}
            processedImage={processedImage}
            selectedFile={selectedFile}
          />
        )}
      </section>
      <About />
      <ContactUs />
    </>
  );
}
export default Home;
