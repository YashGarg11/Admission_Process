import gsap from "gsap";
import { useEffect, useRef } from "react";
import CollegeNavbar from "../components/navbar";

const Course = () => {
  const courseRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1 } });

    tl.fromTo(courseRef.current,
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

      <div className="h-screen flex mx-auto py-40" ref={courseRef}>
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-5xl font-extrabold mb-4">Course Selection</h1>
          <div className="border-2 border-black rounded-lg bg-blue-100 w-3/4 h-full p-8 mx-auto">
            <p className="text-2xl font-bold">
              Please select your preferred course from the options below.
            </p>
            <ul className="list-disc list-inside mt-4 text-xl">
              <li>Computer Science</li>
              <li>Information Technology</li>
              <li>Electronics and Communication</li>
              <li>Mechanical Engineering</li>
              <li>Civil Engineering</li>
            </ul>
          </div>
        </div>

      </div>



    </>
  )
}
export default Course;

