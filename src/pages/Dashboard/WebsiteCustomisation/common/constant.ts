export const initialValues = {
  metaData: {
      name: "Your Organization Name",
      title: "Welcome to [Your Organization]",
      description: "Empowering Individuals, Inspiring Growth.",
      keywords: "education, empowerment, learning, innovation, community",
      author: "Your Name",
      viewport: "width=device-width, initial-scale=1",
      language: "en-US",
      robots: "index, follow",
      themeColor: "#006699",
      ogTitle: "[Your Organization]",
      ogDescription: "Empowering Individuals, Inspiring Growth.",
      ogImageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080",
      faviconUrl: "https://example.com/favicon.ico",
      canonicalUrl: "https://example.com/your-organization",
  },

  hero: [
      {
          image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080",
          title: "Unlock Your True Potential",
          text: "Join us in a transformative journey that fosters personal and academic growth.",
      },
      {
          image: "https://i0.wp.com/picjumbo.com/wp-content/uploads/amazing-stone-path-in-forest-free-image.jpg?w=600&quality=80",
          title: "Innovative Learning Experiences Await",
          text: "Explore new pathways of knowledge and creativity with our unique programs.",
      },
      {
          image: "https://st5.depositphotos.com/35914836/63482/i/450/depositphotos_634821438-stock-photo-beautiful-sunset-sea.jpg",
          title: "Community and Collaboration at Its Best",
          text: "Together, we cultivate an environment where everyone thrives through teamwork.",
      },
  ],

  about: {
      title: "About Us",
      subtitle: "Fostering Growth and Innovation",
      description: [
          "At [Your Organization], we are committed to providing an exceptional experience that empowers individuals to excel.",
          "Our approach integrates creativity, critical thinking, and collaboration, equipping participants to navigate future challenges.",
          "Founded in [Year], we prioritize innovative teaching methods and personalized learning that cater to diverse needs.",
          "With state-of-the-art facilities and a passionate team, we strive to help every individual realize their full potential.",
      ],
      imageUrl: "https://media.istockphoto.com/id/1402604850/photo/the-word-about-us-on-wooden-cubes-business-communication-and-information.jpg?s=612x612&w=0&k=20&c=Oc2HZUPVJRXFsjTwKVgWY_ddWrKeQUG0KCyKUGef-ig=",
  },

  principal: {
      name: "Your Leader's Name",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080",
      title: "A Message From Our Leader",
      subheading: "Guiding You Towards Success with Commitment and Vision",
      bio: [
          "[Your Leader's Name] brings extensive experience in educational leadership, dedicated to nurturing an environment of growth and innovation.",
          "Their mission is to create a supportive atmosphere where every participant feels valued and inspired to achieve.",
      ],
  },

  faq: {
      title: "Frequently Asked Questions",
      subtitle: "Your Questions Answered",
      faqData: [
          {
              question: "How do I get involved?",
              answer: [
                  "Visit our website to explore our programs and select the one that interests you.",
                  "Complete the necessary application forms and submit any required documentation.",
                  "You will receive a confirmation and further details about your involvement shortly.",
              ],
          },
          {
              question: "What opportunities are available?",
              answer: [
                  "We offer a diverse array of programs, including workshops, courses, and community initiatives.",
                  "Participants can engage in activities tailored to their interests and goals.",
                  "Stay updated with announcements about our upcoming offerings.",
              ],
          },
      ],
  },

  curriculum: {
      title: "Our Curriculum",
      description: "We emphasize a holistic approach to education, balancing academic excellence with personal development.",
      sections: [
          {
              title: "Early Learning",
              content: "Engaging activities designed to build foundational skills and foster curiosity.",
          },
          {
              title: "Core Programs",
              content: "A comprehensive curriculum that encourages inquiry, creativity, and critical thinking.",
          },
          {
              title: "Advanced Learning",
              content: "Rigorous courses and electives that prepare individuals for higher education and professional careers.",
          },
      ],
  },

  testimonial: {
      title: "What Our Community Says",
      subTitle: "Voices from Our Participants",
      sections: [
          {
              id: 1,
              name: "Jessica Taylor",
              testimonial: "This organization has profoundly impacted my daughter's confidence and love for learning!",
              imageUrl: "https://static.vecteezy.com/system/resources/thumbnails/026/497/734/small_2x/businessman-on-isolated-png.png",
          },
          {
              id: 2,
              name: "Daniel Clark",
              testimonial: "The supportive community here has made my transition into high school seamless and enjoyable.",
              imageUrl: "https://thumbs.dreamstime.com/b/business-person-gesturing-white-background-19126378.jpg",
          },
          {
              id: 3,
              name: "Ava Johnson",
              testimonial: "I am incredibly grateful for the personalized attention and encouragement I received from my teachers.",
              imageUrl: "https://static.vecteezy.com/system/resources/previews/009/887/693/non_2x/male-man-african-american-black-diversity-person-afro-hair-ethnic-happy-smile-model-close-up-face-enjoyment-hashion-lifestyle-professional-human-father-boy-business-education-young-adult-teenage-photo.jpg",
          },
          {
              id: 4,
              name: "Lucas Martinez",
              testimonial: "This organization has been a wonderful place for my child to grow and explore their interests.",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQBFy0j_72yEKBKNRbPbCzxfNxq1H9Y57ygg&s",
          },
      ],
  },
  map : {
    name: "Aarya Kid's Garden School",
    address: "Plot No. 123, ABC Street, XYZ Nagar, New Delhi, 110001",
    phone: "+91 12345 67890",
    email: "info@aaryakids.com",
    website: "https://www.aaryakids.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1308.3472934977735!2d77.14517463054085!3d28.495267891737505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1ef6a6ac4793%3A0x323e6e261abec9af!2sAarya%20Kid's%20Garden%20School!5e0!3m2!1sen!2sin!4v1728752051958!5m2!1sen!2sin",
  }
};
