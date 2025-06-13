import { observer } from "mobx-react-lite"
import ColorSettingsForm from "./ColorSettingsForm"
import AboutSection from "../../../main/School/component/AboutSection/AboutSection"
import { useState } from "react"

const Sections = observer(() => {
  const  [aboutContent] = useState({
    title: "About Our School",
    subtitle: "Dedicated to Excellence in Education",
    description: [
      "Welcome to Evergreen Academy, a place where students from all backgrounds thrive through intellectual growth and personal development. Our diverse learning environment encourages curiosity, collaboration, and exploration.",
      "Our faculty members, passionate and skilled, strive for excellence, fostering a spirit of innovation and curiosity in every student. They are dedicated to guiding each learner to realize their full potential.",
      "Since 1995, Evergreen Academy has set the benchmark for educational excellence. We are proud of our alumni's significant contributions across various fields, and their impact is felt globally.",
      "Looking toward the future, we continue to invest in top-tier resources, state-of-the-art facilities, and innovative learning methodologies. We are committed to preparing each student to meet the challenges of an evolving world with confidence and knowledge."
  ],
    imageUrl: "https://img.freepik.com/free-photo/anime-school-building-illustration_23-2151150989.jpg",
  })

  return (
    <div>
      <ColorSettingsForm />
      <AboutSection content={aboutContent} />
    </div>
  )
})
export default Sections