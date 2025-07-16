import gsap from "gsap";
import { useEffect, useRef } from "react";
import CollegeNavbar from "../components/navbar";
const About = () => {

  const aboutRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1 } });

    tl.fromTo(aboutRef.current,
      {
        "opacity": 0,
        "y": -100
      },
      {
        "opacity": 1,
        "y": 0
      }
    )
    return () => {
      tl.kill();
    }
  }, []);

  return (
    <>
      <CollegeNavbar />
      <div ref={aboutRef} className="flex h-screen  px-4 py-8 justify-center items-center text-center">
        <div>
          <h1 className="text-5xl font-extrabold  mb-4">About Us</h1>
          <div className=" border-[2px]  border-black rounded-lg bg-blue-100 w-3/4 h-full p-8 mx-auto ">
            <p className="text-2xl font-bold">
              Welcome to our platform! We are dedicated to providing the best experience for our users.
              Our team works tirelessly to ensure that you have access to the latest features and updates.
            </p>
            <p className="text-2xl font-semibold mt-4">
              Our mission is to empower individuals through technology, making it easier for everyone to achieve their goals.
              We believe in innovation, integrity, and inclusivity, and we strive to reflect these values in everything we do.
            </p>
          </div>
        </div>



      </div>
    </>
  );

}

export default About;