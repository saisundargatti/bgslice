import "./about.css";

const About = () => {
  return (
    <div className="about-container" id="about">
      <div className="image-container">
        <img
          src="https://res.cloudinary.com/dlvc5pfmx/image/upload/v1698587776/woman-3481756_1280_v0osvs.jpg"
          alt="Full Background"
          className="image full-background-image"
        />
        <img
          src="https://res.cloudinary.com/dlvc5pfmx/image/upload/v1698587814/woman-3481756_1280_bgremoved_image_rj8jgf.png"
          alt="Background Removed"
          className="image bg-removed-image"
          id="bottomRightImage"
        />
      </div>
      <div className="about-text">
        <h1>Make Your Photos Pop!</h1>
        <h3>
          Remove backgrounds from your photos in seconds with our easy-to-use
          tool
        </h3>
      </div>
    </div>
  );
};

export default About;
