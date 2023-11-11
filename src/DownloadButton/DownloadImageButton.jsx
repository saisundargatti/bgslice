/* eslint-disable react/prop-types */
import "./DownloadButton.css";

function DownloadButton({ processedImage, selectedFile, imageUrl }) {
  const handleDownloadClick = () => {
    if (processedImage) {
      // Split the processedImage to extract base64 data
      const base64Data = `data:image/png;base64,${processedImage}`.split(
        ","
      )[1];
      // Create a blob from the base64-encoded image data
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);

      // Determine the download filename based on selectedFile or imageUrl
      let downloadFilename = "processed_image.png";

      if (selectedFile) {
        downloadFilename = `${
          selectedFile.name.split(".")[0]
        }_bgremoved_image.png`;
      } else if (imageUrl) {
        const imageUrlParts = imageUrl.split("/");
        const imageName = imageUrlParts[imageUrlParts.length - 1];
        downloadFilename = `${imageName.split(".")[0]}_bgremoved_image.png`;
      }

      // Create an anchor element and trigger a click event for download
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      a.click();
    } else {
      // Handle the case where processedImage is undefined
      console.error("processedImage is undefined");
    }
  };

  return <button onClick={handleDownloadClick}>Download</button>;
}

export default DownloadButton;
