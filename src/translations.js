// translations.js
// Usage: import { translations } from "./translations";
// Access: translations["en"].nav.home  or  translations["ru"].nav.home

export const translations = {
  en: {
    /* ── NAV ── */
    nav: {
      home: "Home",
      programs: "Programs",
      camp: "Summer Camp",
      team: "Our Team",
      gallery: "Gallery",
      reviews: "Reviews",
      about: "About",
      contact: "Contact",
      adminLogin: "Admin Login",
      dashboard: "Dashboard",
    },

    /* ── FOOTER ── */
    footer: {
      links: {
        home: "Home",
        programs: "Programs",
        camp: "Summer Camp",
        team: "Our Team",
        gallery: "Gallery",
        reviews: "Reviews",
        about: "About",
        contact: "Contact",
      },
      builtBy: "Designed & built by",
    },

    /* ── COMMON BUTTONS / LABELS ── */
    common: {
      contactUs: "✉️ Contact Us",
      contact: "✉️ Contact",
      viewPrograms: "♟ View Programs",
      explorePrograms: "♟ Explore Programs",
      meetTeam: "👥 Meet Our Team",
      summerCamp: "☀️ Summer Camp",
      viewSummerCamp: "☀️ View Camps",
      joinSummerCamp: "☀️ Join Summer Camp",
      learnMore: "Learn More",
      seeMore: "See More",
      readReviews: "Read Reviews",
      joinCamp: "Join Camp",
      writeReview: "✍️ Write a Review",
      leaveReview: "✍️ Leave a Review",
      backToHome: "♔ Back to Home",
      sendMessage: "Send Message →",
      sending: "⏳ Sending...",
      submit: "Submit →",
      cancel: "Cancel Edit",
      close: "×",
      delete: "🗑 Delete",
      approve: "Approve",
      edit: "✏️ Edit",
      upload: "Upload Photo →",
      uploading: "⏳ Uploading...",
      signIn: "Sign In →",
      logOut: "🚪 Log Out",
    },

    /* ── HOME PAGE ── */
    home: {
      heroBadge: "🗽 New York City · Ages 6–16",
      heroTitle: "Where Kids Become",
      heroTitleEm: "Chess Champions",
      heroSub:
        "Join MyChessFamily — New York's premier chess club for young minds. We build strategy, confidence, and lasting friendships through the timeless game of chess.",
      heroBtn1: "♟ Explore Programs",
      heroBtn2: "☀️ Join Summer Camp",
      heroBtn3: "✉️ Contact",
      stat1n: "500+",
      stat1l: "Young Players",
      stat2n: "8+",
      stat2l: "Years Running",
      stat3n: "3",
      stat3l: "Camps / Year",
      offerTitle: "What We Offer",
      offer1Title: "School Chess Programs",
      offer1Desc:
        "After-school chess programs where students learn the fundamentals of chess and gradually develop strategic thinking.",
      offer2Title: "Private Lessons",
      offer2Desc:
        "Individual training tailored to each student's level, pace, and goals.",
      offer3Title: "Tournament Preparation",
      offer3Desc:
        "Structured training for students preparing to compete in scholastic tournaments.",
      offer4Title: "Team Training",
      offer4Desc:
        "Group training sessions where students prepare together for tournaments and strengthen their skills as a team.",
      offer5Title: "Chess Camps",
      offer5Desc:
        "Immersive chess camps combining training, tournaments, and social activities.",
      section1Title: "Private Lessons",
      section1Text1:
        "My Chess Family offers structured chess training for students of all levels through school programs, private lessons, camps, team training, and tournament preparation.",
      section1Text2:
        "Students grow not only as chess players, but also as individuals in a supportive community built around learning, discipline, and confidence.",
      section1Btn: "Explore Programs",
      section2Title: "Personalized Coaching",
      section2Text1:
        "Every student learns differently. Our coaches build personal connections with students to understand their thinking style, motivation, and learning pace.",
      section2Text2:
        "Through individual lessons and targeted guidance, students receive training that matches their level and helps them progress with confidence.",
      section2Btn: "View Programs",
      section3Title: "Chess Tournaments",
      section3Text1:
        "Tournaments give students real-game experience and help them apply what they learn under pressure. They develop focus, resilience, and better decision-making.",
      section3Text2:
        "We encourage healthy competition, sportsmanship, and steady growth through events that challenge players while keeping the experience positive and rewarding.",
      section3Btn: "Read Reviews",
      section4Title: "Chess Camps",
      section4Text1:
        "Our chess camps combine structured training, tournaments, and fun activities in a dynamic learning environment.",
      section4Text2:
        "Students strengthen their chess skills, build friendships, and enjoy a memorable experience that keeps them engaged and motivated.",
      section4Btn: "Join Camp",
      section5Title: "School Chess Programs",
      section5Text1:
        "My Chess Family partners with schools to bring high-quality chess education directly into the classroom through after-school programs.",
      section5Text2:
        "These programs help students develop focus, patience, and problem-solving skills while introducing them to the strategic world of chess.",
      section5Btn: "Contact Us",
      aboutLabel: "About Us",
      aboutTitle: "About My Chess Family",
      aboutText1:
        "MyChessFamily is a youth chess community built to help students grow in skill, confidence, and character through thoughtful, engaging instruction.",
      aboutText2:
        "From first lessons to competitive preparation, we focus on making each student feel supported, challenged, and excited to improve.",
      aboutText3:
        "Our goal is not only to teach chess well, but also to create a strong, positive environment where students and families feel part of something meaningful.",
      aboutBtn: "Learn More",
    },

    /* ── PROGRAMS PAGE ── */
    programs: {
      kicker: "Our Programs",
      heroTitle: "Find the Right Program",
      heroSub:
        "From beginner after-school programs to serious tournament prep — every program is designed to help your child grow at their own pace.",
      heroBtn1: "✉️ Ask About Pricing",
      heroBtn2: "☀️ Summer Camp",
      stat1n: "5",
      stat1l: "Programs Offered",
      stat2n: "500+",
      stat2l: "Students Taught",
      stat3n: "8+",
      stat3l: "Years Experience",
      stat4n: "6–16",
      stat4l: "Age Range",
      ctaTitle: "Not sure which program fits?",
      ctaText:
        "We personally help every family find the right fit based on age, experience, and goals. Just reach out — we'll guide you.",
      programs: [
        {
          title: "School Chess Programs",
          tag: "Most Popular",
          price: "Contact for Pricing",
          duration: "Weekly Sessions",
          age: "Ages 6–16",
          level: "All Levels",
          desc: "After-school chess programs where students learn the fundamentals of chess in a structured and engaging environment. We partner directly with schools to bring high-quality coaching into the classroom.",
          highlights: [
            "Strategic thinking & problem-solving",
            "Structured curriculum per level",
            "School partnership programs",
            "Progress tracking for parents",
          ],
          button: "Contact Us",
        },
        {
          title: "Private Lessons",
          tag: "One-on-One",
          price: "From $80 / session",
          duration: "60 or 90 min",
          age: "Ages 6–16",
          level: "All Levels",
          desc: "One-on-one coaching tailored entirely to your child. Whether a complete beginner or preparing for competition, private lessons deliver the fastest, most focused improvement.",
          highlights: [
            "Personalized training plan",
            "Flexible scheduling",
            "In-person or online",
            "Beginner to advanced",
          ],
          button: "Meet Our Team",
        },
        {
          title: "Tournament Preparation",
          tag: "Competitive",
          price: "Contact for Pricing",
          duration: "Ongoing Program",
          age: "Ages 8–16",
          level: "Intermediate – Advanced",
          desc: "Structured training for students who compete in scholastic tournaments. Opening preparation, game analysis, endgame technique, and the mental skills to perform under pressure.",
          highlights: [
            "Opening repertoire building",
            "Game & mistake analysis",
            "Endgame & tactics training",
            "Psychological readiness",
          ],
          button: "Contact Us",
        },
        {
          title: "Team Training",
          tag: "Group",
          price: "Contact for Pricing",
          duration: "Weekly Sessions",
          age: "Ages 8–16",
          level: "Intermediate",
          desc: "Collaborative group sessions where students prepare for tournaments together, analyze games, and push each other to improve in a team-based learning environment.",
          highlights: [
            "Team strategy & dynamics",
            "Peer game analysis",
            "Collaborative learning",
            "Competitive team prep",
          ],
          button: "Contact Us",
        },
        {
          title: "Chess Camps",
          tag: "Summer Program",
          price: "From $350 / week",
          duration: "Full & Half Day",
          age: "Ages 6–16",
          level: "All Levels",
          desc: "Intensive week-long summer camps combining structured lessons, practice games, puzzles, and fun activities. Students improve fast while making lasting friendships.",
          highlights: [
            "Full & half-day options",
            "All skill levels welcome",
            "Daily puzzles & games",
            "Small group sizes",
          ],
          button: "View Summer Camp",
        },
      ],
    },

    /* ── CAMP PAGE ── */
    camp: {
      label: "Summer Program",
      title: "Summer Chess Camp",
      sub: "Intensive chess training, practical tournament experience, and a fun learning environment where students build skill, confidence, and friendships.",
      noSessions: "No camp sessions scheduled yet.",
      perChild: "/ child",
      contact: "Contact",
      signUp: "Sign Up Now",
      preRegister: "Pre-Register",
      closed: "Registration Closed",
      regModal: {
        title: "Sign Up:",
        firstName: "First Name",
        firstNamePh: "e.g. Alex",
        lastName: "Last Name",
        lastNamePh: "e.g. Johnson",
        dob: "Date of Birth",
        level: "Chess Level",
        levelPh: "Select level",
        levelOpts: [
          "Never played before",
          "Knows the basics",
          "Plays regularly",
          "Tournament player",
        ],
        parent: "Parent / Guardian",
        parentPh: "Full name",
        email: "Email",
        emailPh: "parent@email.com",
        phone: "Phone",
        phonePh: "(212) 555-0000",
        emergency: "Emergency Contact",
        emergencyPh: "Name · (212) 555-0001",
        medical: "Allergies / Medical Notes",
        medicalPh: "Any info we should know...",
        submitBtn: "Submit Registration →",
        successTitle: "You're registered!",
        successSub: "Confirmation details will be sent to your email.",
        required: "Please fill in all required fields.",
      },
      metaDate: "📅",
      metaLocation: "📍",
      metaAge: "👦",
      metaTime: "⏰",
    },

    /* ── TEAM PAGE ── */
    team: {
      kicker: "Meet Our Team",
      heroTitle: "Experienced Coaches. Personal Guidance. Real Growth.",
      heroSub:
        "My Chess Family brings together dedicated teachers, competitive players, and experienced mentors who help students grow in skill, confidence, and character through chess.",
      founderRole: "Founder & Head Coach",
      founderName: "Dmitri Shevelev",
      founderP1:
        "My Chess Family was founded by FIDE Master Dmitri Shevelev, an experienced chess educator who has spent decades teaching children how to think strategically, compete with confidence, and grow through the game.",
      founderP2:
        "His teaching philosophy is built on empathy, discipline, and personal connection. Every student is different, and the goal is to match each child with the right support, the right pace, and the right environment for long-term growth.",
      founderP3:
        "Under his leadership, My Chess Family has grown into a community where students receive strong chess instruction while also developing resilience, focus, and character.",
      coachTitle: "Our Coaching Team",
      coachSub:
        "Our team includes friendly, professional coaches who know how to make chess challenging, supportive, and engaging for students at every level.",
      feat1Title: "Personalized Teaching",
      feat1Text:
        "Coaches focus on each student's personality, level, and learning style to create a more effective and encouraging experience.",
      feat2Title: "Competitive Experience",
      feat2Text:
        "Students learn from coaches who understand tournament play and can help them prepare with strategy, discipline, and practical guidance.",
      feat3Title: "Supportive Community",
      feat3Text:
        "Beyond instruction, our team helps create a welcoming environment where students feel motivated, respected, and excited to improve.",
      ctaTitle: "Want help choosing the right coach?",
      ctaText:
        "We can help you choose the best fit based on your child's age, level, goals, and learning style.",

      cards: [
        {
          role: "Head Coach",
          bio: "10+ years coaching youth chess. Loves teaching endgames and helping kids build confidence.",
          tags: ["Endgames", "Tournament Prep", "Mentorship"],
        },
        {
          role: "Junior Coach",
          bio: "Former state scholastic champion. Specializes in beginners and building strong fundamentals.",
          tags: ["Beginners", "Tactics", "Confidence"],
        },
        {
          role: "Camp Coordinator",
          bio: "Designs our summer camp experience. Makes every week organized, fun, and unforgettable.",
          tags: ["Camps", "Logistics", "Community"],
        },
        {
          role: "Strategy Coach",
          bio: "Focuses on middle-game plans and practical decision-making under time pressure.",
          tags: ["Strategy", "Middlegames", "Time Mgmt"],
        },
      ],
    },

    /* ── REVIEWS PAGE ── */
    reviews: {
      kicker: "Parents & Students",
      heroTitle: "What Families Say About Us",
      heroSub:
        "Feedback from students and families who have experienced My Chess Family through lessons, camps, tournaments, and long-term coaching.",
      ratingMeta: "Based on",
      ratingMetaEnd: "review",
      ratingMetaEndPlural: "reviews",
      stat1Label: "Average Rating",
      stat2Label: "Published Reviews",
      stat3n: "100%",
      stat3Label: "Focused On Student Growth",
      noReviews: "No approved reviews yet",
      noReviewsSub: "Be the first family to share your experience.",
      ctaTitle: "Share your experience with My Chess Family",
      ctaText:
        "Your review helps other families understand what it feels like to learn, grow, and compete as part of our chess community.",
      modal: {
        title: "Write a Review",
        childName: "Child Name (optional)",
        childNamePh: "Optional",
        rating: "Rating",
        review: "Review",
        reviewPh: "Share your experience...",
        submitBtn: "Submit Review →",
        tooShort: "Write at least 10 characters.",
        successTitle: "Submitted!",
        successSub: "Your review will appear after admin approval.",
      },
    },

    /* ── ABOUT PAGE ── */
    about: {
      kicker: "About My Chess Family",
      heroTitle: "More Than a Chess School — A Community for Growth",
      heroSub:
        "My Chess Family helps children develop strategic thinking, confidence, resilience, and character through high-quality chess education in a supportive and inspiring environment.",
      storyTitle: "Our Story",
      storyP1:
        "My Chess Family is a chess education program dedicated to helping children grow not only as players, but also as people. Through structured training, tournament experience, and supportive mentorship, students build skills that go far beyond the chessboard.",
      storyP2:
        "The program brings together experienced coaches, master-level players, and grandmasters to create a strong learning environment for students of all levels — from complete beginners to serious tournament competitors.",
      storyP3:
        "What makes My Chess Family special is the sense of connection. Students, coaches, and families become part of a real community built on encouragement, discipline, and long-term growth.",
      founderSectionTitle: "Founded With Purpose",
      founderSectionSub:
        "The vision behind My Chess Family is rooted in strong teaching, empathy, and the belief that every child can grow through the game of chess.",
      founderRole: "Founder & Head Coach",
      founderName: "Dmitri Shevelev",
      founderP1:
        "My Chess Family was founded by FIDE Master Dmitri Shevelev, an experienced chess educator with more than two decades of teaching experience. He began playing chess at age six and teaching at eighteen, later continuing his work in the United States.",
      founderP2:
        "Over the years, Dmitri has taught thousands of students through school programs, private lessons, camps, and tournament preparation. His work has included beginners learning the game for the first time as well as advanced players preparing for serious competition.",
      founderP3:
        "His philosophy is simple: every child is unique, and the best teaching happens when coaches understand how a student thinks, learns, and grows with confidence.",
      valuesTitle: "What We Help Students Build",
      valuesSub:
        "Chess is used as an educational tool to develop practical skills, emotional strength, and long-term confidence.",
      value1Title: "Strategic Thinking",
      value1Text:
        "Students learn how to think ahead, evaluate options, and make thoughtful decisions with greater clarity.",
      value2Title: "Focus & Discipline",
      value2Text:
        "Chess helps students improve concentration, patience, and the ability to stay engaged with challenging problems.",
      value3Title: "Confidence & Resilience",
      value3Text:
        "Students learn how to handle mistakes, recover from losses, and continue improving with maturity and self-belief.",
      value4Title: "Community & Character",
      value4Text:
        "Families become part of a supportive environment where students encourage one another and grow through shared experience.",
      ctaTitle: "Discover the right path for your child",
      ctaText:
        "Whether your child is just starting or already competing, My Chess Family offers a supportive environment to learn, improve, and grow with confidence.",
      faqTitle: "Frequently Asked Questions",
      faqSub:
        "A few common questions parents ask before getting started with My Chess Family.",
      faqs: [
        {
          q: "What age groups do you teach?",
          a: "My Chess Family works with children ages 6–16 through school programs, private lessons, camps, and tournament training.",
        },
        {
          q: "Does my child need chess experience before joining?",
          a: "No. We welcome complete beginners as well as experienced tournament players, and we guide each child based on their level and pace.",
        },
        {
          q: "Do you offer private lessons?",
          a: "Yes. We offer private coaching for students who want more personalized attention, faster improvement, or targeted tournament preparation.",
        },
        {
          q: "What happens during summer camp?",
          a: "Our summer camps combine structured lessons, practice games, puzzle solving, fun activities, and a supportive environment that keeps students engaged.",
        },
        {
          q: "Do you work with schools and organizations?",
          a: "Yes. We partner with schools to provide after-school chess programs and can help create the right setup for students and communities.",
        },
        {
          q: "How do I choose the right program for my child?",
          a: "We help families choose the best fit based on age, current level, goals, and learning style. You can contact us and we'll guide you personally.",
        },
      ],
    },

    /* ── GALLERY PAGE ── */
    gallery: {
      kicker: "Photo Gallery",
      heroTitle: "Life at MyChessFamily",
      heroSub:
        "A look inside our lessons, summer camps, and the moments that make our chess community special. Real students. Real growth. Real memories.",
      stat1n: "500+",
      stat1l: "Students Taught",
      stat2n: "8+",
      stat2l: "Years of Memories",
      stat3n: "3",
      stat3l: "Camps Per Year",
      filterAll: "All Photos",
      filterCamps: "Summer Camps",
      filterLessons: "Lessons",
      filterCommunity: "Community",
      loading: "Loading gallery...",
      noPhotos: "No photos yet",
      noPhotosSub: "Photos will appear here once the admin uploads them.",
      ctaTitle: "Be part of the MyChessFamily story",
      ctaText:
        "Every photo here represents a student who chose to learn, compete, and grow. Join us and create your own memories on the board.",
    },

    /* ── CONTACT PAGE ── */
    contact: {
      kicker: "Get In Touch",
      heroTitle: "We'd Love to Hear From You",
      heroSub:
        "Have a question about our programs, camps, or private lessons? Fill out the form and we'll get back to you within 24 hours.",
      info: [
        {
          label: "Location",
          value: "New York City",
          note: "Serving all NYC boroughs and surrounding areas",
        },
        {
          label: "Email",
          value: "mychessfamily@gmail.com",
          actionLabel: "Click to copy",
        },
        {
          label: "Hours",
          value: "Mon – Sat · 9AM – 7PM",
          note: "Eastern Time · Closed Sundays",
        },
        {
          label: "Response Time",
          value: "Within 24 Hours",
          note: "Usually much faster during business hours",
        },
      ],
      socialTitle: "Follow Us",
      quickLinksTitle: "Quick Links",
      quickLinks: [
        ["programs", "♟ View Programs"],
        ["camp", "☀️ Summer Camp"],
        ["team", "👥 Meet Our Team"],
        ["reviews", "⭐ Read Reviews"],
      ],
      formTitle: "Send Us a Message",
      formSub:
        "Tell us about your child, what you're looking for, and any questions you have. We'll personally get back to you with the best options.",
      firstName: "First Name",
      firstNamePh: "e.g. Alex",
      lastName: "Last Name",
      lastNamePh: "e.g. Johnson",
      email: "Email",
      emailPh: "parent@email.com",
      phone: "Phone",
      phonePh: "(212) 555-0000",
      interestedIn: "I'm Interested In",
      interestedPh: "Select a program (optional)",
      interestedOpts: [
        "Private Lessons",
        "School Chess Program",
        "Summer Camp",
        "Tournament Preparation",
        "Team Training",
        "General Inquiry",
      ],
      subject: "Subject",
      subjectPh: "e.g. Question about summer camp pricing",
      message: "Message",
      messagePh:
        "Tell us about your child's age, experience level, and what you're hoping to achieve...",
      errRequired: "Please fill in all required fields.",
      errEmail: "Please enter a valid email address.",
      privacy:
        "By submitting this form you agree to be contacted about MyChessFamily programs. We never share your information.",
      successTitle: "Message Received!",
      successSub1:
        "Thank you for reaching out. We'll get back to you within 24 hours at",
      successSub2:
        "In the meantime, feel free to explore our programs or check out our summer camp.",
      sendAnother: "Send Another",
      ctaTitle: "Ready to get started?",
      ctaText:
        "Join hundreds of NYC students who have grown in skill, confidence, and character through MyChessFamily. The first step is just a message away.",
    },

    /* ── CONTACT MODAL (popup) ── */
    contactModal: {
      title: "Contact Us",
      clickToCopy: "Click to copy",
      fastest: "For fastest response, email us.",
    },

    /* ── CHATBOT ── */
    chatbot: {
      title: "♟ Chess Assistant",
      sub: "MyChessFamily help desk",
      placeholder: "Ask about programs, camps, lessons...",
      send: "Send",
      suggestions: [
        "What programs do you offer?",
        "How much is summer camp?",
        "Do you offer private lessons?",
        "What age groups do you teach?",
      ],
      welcome:
        "Hi! I'm the MyChessFamily assistant. Ask me about programs, camps, private lessons, or age groups.",
      fallback:
        "Sorry, I couldn't respond right now. Please email mychessfamily@gmail.com.",
    },

    /* ── 404 PAGE ── */
    notFound: {
      code: "404",
      title: "Looks like this page made an illegal move",
      sub: "The page you're looking for doesn't exist or has been moved. Don't worry — even grandmasters blunder sometimes. Let's get you back on the board.",
      btn1: "♔ Back to Home",
      btn2: "♟ View Programs",
    },

    /* ── LOGIN PAGE ── */
    login: {
      title: "Admin Login",
      sub: "Sign in to manage camps and view registrations.",
      username: "Username",
      password: "Password",
      demo: "Demo credentials:",
      wrongCreds: "❌ Wrong credentials. Use: admin / chess123",
    },

    /* ── ADMIN PAGE ── */
    admin: {
      welcome: "Welcome, Admin! 👋",
      label: "Admin Dashboard",
      tabs: {
        camps: "☀️ Manage Camps",
        campregs: "🏕 Camp Sign-Ups",
        reviews: "⭐ Reviews",
        gallery: "📸 Gallery",
      },
      stats: {
        sessions: "Camp Sessions",
        signups: "Camp Sign-Ups",
        revenue: "Est. Camp Revenue",
      },
      addCamp: "➕ Add New Camp Session",
      editCamp: "✏️ Edit Camp Session",
      fields: {
        name: "Camp Session Name",
        namePh: "e.g. Summer Chess Camp – Session 3",
        startDate: "Start Date",
        endDate: "End Date",
        location: "Location",
        locationPh: "e.g. Chess Club HQ",
        type: "Session Type",
        age: "Age Group",
        price: "Price per Child ($)",
        pricePh: "e.g. 350",
        spots: "Max Spots",
        spotsPh: "e.g. 20",
        status: "Status",
        image: "Camp Image",
        desc: "Description",
        descPh: "What's included in this session...",
      },
      statusOpts: { open: "Open", upcoming: "Upcoming", full: "Full" },
      typeOpts: ["Half Day (9AM–1PM)", "Full Day (9AM–5PM)"],
      ageOpts: [
        "All Ages (6–16)",
        "Juniors (6–10)",
        "Intermediates (11–13)",
        "Seniors (14–16)",
      ],
      addBtn: "Add Camp Session →",
      updateBtn: "Update Camp Session →",
      published: "✅ Camp session published!",
      updated: "✅ Camp updated!",
      allSessions: "All Camp Sessions",
      noSessions: "No camp sessions yet.",
      signupsTitle: "Camp Sign-Ups",
      noSignups: "No camp sign-ups yet.",
      reviewsTitle: "Reviews",
      noReviews: "No reviews yet.",
      galleryTitle: "Gallery Photos",
      noPhotos: "No photos uploaded yet.",
      uploadTitle: "📸 Upload New Photo",
      galleryFields: {
        photo: "Photo",
        caption: "Caption",
        captionPh: "e.g. Students at summer camp 2024",
        category: "Category",
        tag: "Tag (optional)",
        tagPh: "e.g. Summer Camp 2024",
      },
      categoryOpts: [
        { value: "camps", label: "Summer Camps" },
        { value: "lessons", label: "Lessons" },
        { value: "community", label: "Community" },
      ],
      deleteConfirmCamp: "Delete this camp session?",
      deleteConfirmSignup: "Delete this camp sign-up?",
      deleteConfirmReview: "Delete this review?",
      deleteConfirmPhoto: "Delete this photo?",
      statusUpdated: "Status updated!",
      deleted: "Deleted.",
      approved: "✅ Approved!",
      signupDeleted: "Sign-up deleted.",
    },

    /* ── BADGE STATUS ── */
    badge: {
      open: "Open",
      full: "Full",
      upcoming: "Upcoming",
    },

    /* ── TOASTS ── */
    toast: {
      emailCopied: "📋 Email copied!",
      regSubmitted: "🎉 Registration submitted!",
      reviewSubmitted: "✅ Review submitted! Waiting for admin approval.",
      messageSent: "✅ Message sent!",
      photoUploaded: "📸 Photo uploaded!",
      loggedIn: "✅ Welcome back, Admin!",
      loggedOut: "👋 Logged out.",
      fallbackData: "Using fallback local data. Start backend server for sync.",
    },
  },

  /* ═══════════════════════════════════════════════
     RUSSIAN
  ═══════════════════════════════════════════════ */
  ru: {
    /* ── NAV ── */
    nav: {
      home: "Главная",
      programs: "Программы",
      camp: "Летний лагерь",
      team: "Наша команда",
      gallery: "Галерея",
      reviews: "Отзывы",
      about: "О нас",
      contact: "Контакты",
      adminLogin: "Вход для админа",
      dashboard: "Панель управления",
    },

    /* ── FOOTER ── */
    footer: {
      links: {
        home: "Главная",
        programs: "Программы",
        camp: "Летний лагерь",
        team: "Наша команда",
        gallery: "Галерея",
        reviews: "Отзывы",
        about: "О нас",
        contact: "Контакты",
      },
      builtBy: "Разработано и создано",
    },

    /* ── COMMON BUTTONS / LABELS ── */
    common: {
      contactUs: "✉️ Связаться с нами",
      contact: "✉️ Контакты",
      viewPrograms: "♟ Смотреть программы",
      explorePrograms: "♟ Программы",
      meetTeam: "👥 Познакомьтесь с командой",
      summerCamp: "☀️ Летний лагерь",
      viewSummerCamp: "☀️ Лагеря",
      joinSummerCamp: "☀️ Записаться в лагерь",
      learnMore: "Узнать больше",
      seeMore: "Подробнее",
      readReviews: "Читать отзывы",
      joinCamp: "Записаться в лагерь",
      writeReview: "✍️ Написать отзыв",
      leaveReview: "✍️ Оставить отзыв",
      backToHome: "♔ На главную",
      sendMessage: "Отправить сообщение →",
      sending: "⏳ Отправка...",
      submit: "Отправить →",
      cancel: "Отменить редактирование",
      close: "×",
      delete: "🗑 Удалить",
      approve: "Одобрить",
      edit: "✏️ Изменить",
      upload: "Загрузить фото →",
      uploading: "⏳ Загрузка...",
      signIn: "Войти →",
      logOut: "🚪 Выйти",
    },

    /* ── HOME PAGE ── */
    home: {
      heroBadge: "🗽 Нью-Йорк · Возраст 6–16",
      heroTitle: "Где дети становятся",
      heroTitleEm: "Чемпионами по шахматам",
      heroSub:
        "Присоединяйтесь к MyChessFamily — ведущему шахматному клубу Нью-Йорка для юных умов. Мы развиваем стратегическое мышление, уверенность и крепкую дружбу через великую игру в шахматы.",
      heroBtn1: "♟ Программы",
      heroBtn2: "☀️ Летний лагерь",
      heroBtn3: "✉️ Контакты",
      stat1n: "500+",
      stat1l: "Юных игроков",
      stat2n: "8+",
      stat2l: "Лет работы",
      stat3n: "3",
      stat3l: "Лагеря в год",
      offerTitle: "Что мы предлагаем",
      offer1Title: "Школьные шахматные программы",
      offer1Desc:
        "Внеклассные шахматные программы, где ученики изучают основы шахмат и постепенно развивают стратегическое мышление.",
      offer2Title: "Индивидуальные занятия",
      offer2Desc:
        "Персональные тренировки, адаптированные к уровню, темпу и целям каждого ученика.",
      offer3Title: "Подготовка к турнирам",
      offer3Desc:
        "Структурированные тренировки для учеников, готовящихся участвовать в школьных турнирах.",
      offer4Title: "Командные тренировки",
      offer4Desc:
        "Групповые занятия, где ученики вместе готовятся к турнирам и укрепляют навыки в командной обстановке.",
      offer5Title: "Шахматные лагеря",
      offer5Desc:
        "Интенсивные шахматные лагеря, сочетающие тренировки, турниры и развлечения.",
      section1Title: "Индивидуальные занятия",
      section1Text1:
        "My Chess Family предлагает структурированные шахматные тренировки для учеников всех уровней: школьные программы, индивидуальные занятия, лагеря, командные тренировки и подготовку к турнирам.",
      section1Text2:
        "Ученики растут не только как шахматисты, но и как личности в поддерживающем сообществе, построенном на обучении, дисциплине и уверенности.",
      section1Btn: "Смотреть программы",
      section2Title: "Персонализированный коучинг",
      section2Text1:
        "Каждый ученик учится по-своему. Наши тренеры выстраивают личный контакт с учениками, чтобы понять их стиль мышления, мотивацию и темп обучения.",
      section2Text2:
        "Через индивидуальные занятия и целевое руководство ученики получают тренировки, соответствующие их уровню, и уверенно прогрессируют.",
      section2Btn: "Смотреть программы",
      section3Title: "Шахматные турниры",
      section3Text1:
        "Турниры дают ученикам опыт реальных партий и помогают применять знания под давлением. Они развивают концентрацию, стойкость и принятие решений.",
      section3Text2:
        "Мы поощряем здоровую конкуренцию, спортивное поведение и стабильный рост через мероприятия, которые бросают вызов игрокам и делают опыт позитивным.",
      section3Btn: "Читать отзывы",
      section4Title: "Шахматные лагеря",
      section4Text1:
        "Наши шахматные лагеря сочетают структурированные тренировки, турниры и развлечения в динамичной учебной среде.",
      section4Text2:
        "Ученики совершенствуют шахматные навыки, заводят друзей и наслаждаются незабываемым опытом, который держит их вовлечёнными и мотивированными.",
      section4Btn: "Записаться в лагерь",
      section5Title: "Школьные шахматные программы",
      section5Text1:
        "My Chess Family сотрудничает со школами, чтобы принести высококачественное шахматное образование прямо в класс через внеклассные программы.",
      section5Text2:
        "Эти программы помогают ученикам развивать концентрацию, терпение и навыки решения проблем, знакомя их со стратегическим миром шахмат.",
      section5Btn: "Связаться с нами",
      aboutLabel: "О нас",
      aboutTitle: "О My Chess Family",
      aboutText1:
        "MyChessFamily — это молодёжное шахматное сообщество, созданное для того, чтобы помочь ученикам расти в мастерстве, уверенности и характере через продуманное, увлекательное обучение.",
      aboutText2:
        "От первых занятий до соревновательной подготовки — мы стараемся сделать так, чтобы каждый ученик чувствовал поддержку, получал вызов и был рад совершенствоваться.",
      aboutText3:
        "Наша цель — не только хорошо учить шахматам, но и создать сильную позитивную среду, где ученики и семьи чувствуют себя частью чего-то значимого.",
      aboutBtn: "Узнать больше",
    },

    /* ── PROGRAMS PAGE ── */
    programs: {
      kicker: "Наши программы",
      heroTitle: "Найдите подходящую программу",
      heroSub:
        "От начинающих внеклассных программ до серьёзной турнирной подготовки — каждая программа разработана так, чтобы ваш ребёнок рос в своём темпе.",
      heroBtn1: "✉️ Узнать цены",
      heroBtn2: "☀️ Летний лагерь",
      stat1n: "5",
      stat1l: "Программ",
      stat2n: "500+",
      stat2l: "Учеников",
      stat3n: "8+",
      stat3l: "Лет опыта",
      stat4n: "6–16",
      stat4l: "Возраст",
      ctaTitle: "Не знаете, какая программа подойдёт?",
      ctaText:
        "Мы лично помогаем каждой семье найти наилучший вариант, исходя из возраста, опыта и целей. Просто напишите нам — мы вас направим.",
      programs: [
        {
          title: "Школьные шахматные программы",
          tag: "Самая популярная",
          price: "Узнать цену",
          duration: "Еженедельные занятия",
          age: "Возраст 6–16",
          level: "Все уровни",
          desc: "Внеклассные шахматные программы, где ученики учатся основам шахмат в структурированной и увлекательной среде. Мы напрямую сотрудничаем со школами, чтобы принести качественный коучинг прямо в класс.",
          highlights: [
            "Стратегическое мышление и решение задач",
            "Структурированная программа по уровням",
            "Партнёрские программы со школами",
            "Отслеживание прогресса для родителей",
          ],
          button: "Связаться с нами",
        },
        {
          title: "Индивидуальные занятия",
          tag: "Один на один",
          price: "От $80 / занятие",
          duration: "60 или 90 мин",
          age: "Возраст 6–16",
          level: "Все уровни",
          desc: "Индивидуальный коучинг, полностью адаптированный к вашему ребёнку. Будь то полный новичок или участник соревнований — индивидуальные занятия дают наибыстрейший и наиболее сфокусированный прогресс.",
          highlights: [
            "Персональный план тренировок",
            "Гибкое расписание",
            "Очно или онлайн",
            "От начинающего до продвинутого",
          ],
          button: "Познакомьтесь с командой",
        },
        {
          title: "Подготовка к турнирам",
          tag: "Соревновательная",
          price: "Узнать цену",
          duration: "Постоянная программа",
          age: "Возраст 8–16",
          level: "Средний – Продвинутый",
          desc: "Структурированные тренировки для учеников, участвующих в школьных турнирах. Дебютная подготовка, анализ партий, техника эндшпиля и психологические навыки для выступлений под давлением.",
          highlights: [
            "Построение дебютного репертуара",
            "Анализ партий и ошибок",
            "Тренировка тактики и эндшпиля",
            "Психологическая готовность",
          ],
          button: "Связаться с нами",
        },
        {
          title: "Командные тренировки",
          tag: "Групповые",
          price: "Узнать цену",
          duration: "Еженедельные занятия",
          age: "Возраст 8–16",
          level: "Средний уровень",
          desc: "Совместные групповые занятия, где ученики вместе готовятся к турнирам, анализируют партии и помогают друг другу расти в командной обстановке.",
          highlights: [
            "Командная стратегия и динамика",
            "Анализ партий в группе",
            "Совместное обучение",
            "Подготовка к командным соревнованиям",
          ],
          button: "Связаться с нами",
        },
        {
          title: "Шахматные лагеря",
          tag: "Летняя программа",
          price: "От $350 / неделя",
          duration: "Полный и полудень",
          age: "Возраст 6–16",
          level: "Все уровни",
          desc: "Интенсивные недельные летние лагеря, сочетающие структурированные занятия, тренировочные партии, головоломки и развлечения. Ученики быстро прогрессируют и заводят крепкую дружбу.",
          highlights: [
            "Варианты полного и неполного дня",
            "Приветствуются все уровни",
            "Ежедневные головоломки и партии",
            "Небольшие группы",
          ],
          button: "Смотреть летний лагерь",
        },
      ],
    },

    /* ── CAMP PAGE ── */
    camp: {
      label: "Летняя программа",
      title: "Летний шахматный лагерь",
      sub: "Интенсивные шахматные тренировки, практический турнирный опыт и весёлая учебная среда, где ученики развивают мастерство, уверенность и дружбу.",
      noSessions: "Пока нет запланированных сессий лагеря.",
      perChild: "/ ребёнок",
      contact: "Контакты",
      signUp: "Записаться",
      preRegister: "Предварительная запись",
      closed: "Запись закрыта",
      regModal: {
        title: "Записаться:",
        firstName: "Имя",
        firstNamePh: "напр. Алекс",
        lastName: "Фамилия",
        lastNamePh: "напр. Иванов",
        dob: "Дата рождения",
        level: "Уровень шахмат",
        levelPh: "Выберите уровень",
        levelOpts: [
          "Никогда не играл",
          "Знает основы",
          "Играет регулярно",
          "Участник турниров",
        ],
        parent: "Родитель / Опекун",
        parentPh: "Полное имя",
        email: "Email",
        emailPh: "parent@email.com",
        phone: "Телефон",
        phonePh: "(212) 555-0000",
        emergency: "Экстренный контакт",
        emergencyPh: "Имя · (212) 555-0001",
        medical: "Аллергии / Медицинские заметки",
        medicalPh: "Любая информация, которую нам нужно знать...",
        submitBtn: "Отправить заявку →",
        successTitle: "Вы зарегистрированы!",
        successSub: "Детали подтверждения будут отправлены на ваш email.",
        required: "Пожалуйста, заполните все обязательные поля.",
      },
      metaDate: "📅",
      metaLocation: "📍",
      metaAge: "👦",
      metaTime: "⏰",
    },

    /* ── TEAM PAGE ── */
    team: {
      kicker: "Наша команда",
      heroTitle: "Опытные тренеры. Личное руководство. Реальный рост.",
      heroSub:
        "My Chess Family объединяет преданных педагогов, соревновательных игроков и опытных наставников, которые помогают ученикам расти в мастерстве, уверенности и характере через шахматы.",
      founderRole: "Основатель и главный тренер",
      founderName: "Дмитрий Шевелев",
      founderP1:
        "My Chess Family основана ФИДЕ-мастером Дмитрием Шевелевым — опытным шахматным педагогом, который десятилетиями учит детей мыслить стратегически, соревноваться с уверенностью и расти через игру.",
      founderP2:
        "Его педагогическая философия построена на эмпатии, дисциплине и личном контакте. Каждый ученик уникален, и цель — подобрать каждому ребёнку правильную поддержку, правильный темп и правильную среду для долгосрочного роста.",
      founderP3:
        "Под его руководством My Chess Family выросла в сообщество, где ученики получают сильное шахматное обучение, одновременно развивая стойкость, концентрацию и характер.",
      coachTitle: "Наша тренерская команда",
      coachSub:
        "В нашу команду входят дружелюбные, профессиональные тренеры, которые умеют сделать шахматы сложными, поддерживающими и увлекательными для учеников любого уровня.",
      feat1Title: "Персонализированное обучение",
      feat1Text:
        "Тренеры фокусируются на личности, уровне и стиле обучения каждого ученика, чтобы создать более эффективный и воодушевляющий опыт.",
      feat2Title: "Соревновательный опыт",
      feat2Text:
        "Ученики учатся у тренеров, которые понимают турнирную игру и могут помочь им готовиться со стратегией, дисциплиной и практическим руководством.",
      feat3Title: "Поддерживающее сообщество",
      feat3Text:
        "Помимо обучения, наша команда помогает создать гостеприимную среду, где ученики чувствуют мотивацию, уважение и стремление к совершенствованию.",
      ctaTitle: "Хотите помощи в выборе тренера?",
      ctaText:
        "Мы поможем выбрать лучший вариант, исходя из возраста, уровня, целей и стиля обучения вашего ребёнка.",

      cards: [
        {
          role: "Главный тренер",
          bio: "Более 10 лет обучает детей шахматам. Любит преподавать эндшпиль и помогать детям становиться увереннее.",
          tags: ["Эндшпиль", "Подготовка к турнирам", "Наставничество"],
        },
        {
          role: "Младший тренер",
          bio: "Бывшая чемпионка штата среди школьников. Специализируется на начинающих и сильной базе.",
          tags: ["Начинающие", "Тактика", "Уверенность"],
        },
        {
          role: "Координатор лагеря",
          bio: "Организует нашу летнюю шахматную программу. Делает каждую неделю интересной, веселой и отлично спланированной.",
          tags: ["Лагерь", "Организация", "Сообщество"],
        },
        {
          role: "Тренер по стратегии",
          bio: "Сосредоточен на планах в миттельшпиле и практическом принятии решений в условиях нехватки времени.",
          tags: ["Стратегия", "Миттельшпиль", "Контроль времени"],
        },
      ],
    },

    /* ── REVIEWS PAGE ── */
    reviews: {
      kicker: "Родители и ученики",
      heroTitle: "Что говорят семьи о нас",
      heroSub:
        "Отзывы учеников и семей, которые познакомились с My Chess Family через занятия, лагеря, турниры и долгосрочный коучинг.",
      ratingMeta: "На основе",
      ratingMetaEnd: "отзыва",
      ratingMetaEndPlural: "отзывов",
      stat1Label: "Средняя оценка",
      stat2Label: "Опубликованных отзывов",
      stat3n: "100%",
      stat3Label: "Ориентированы на рост учеников",
      noReviews: "Пока нет одобренных отзывов",
      noReviewsSub: "Станьте первой семьёй, поделившейся своим опытом.",
      ctaTitle: "Поделитесь своим опытом с My Chess Family",
      ctaText:
        "Ваш отзыв помогает другим семьям понять, каково это — учиться, расти и соревноваться в нашем шахматном сообществе.",
      modal: {
        title: "Написать отзыв",
        childName: "Имя ребёнка (необязательно)",
        childNamePh: "Необязательно",
        rating: "Оценка",
        review: "Отзыв",
        reviewPh: "Поделитесь своим опытом...",
        submitBtn: "Отправить отзыв →",
        tooShort: "Напишите не менее 10 символов.",
        successTitle: "Отправлено!",
        successSub: "Ваш отзыв появится после одобрения администратором.",
      },
    },

    /* ── ABOUT PAGE ── */
    about: {
      kicker: "О My Chess Family",
      heroTitle: "Не просто шахматная школа — сообщество для роста",
      heroSub:
        "My Chess Family помогает детям развивать стратегическое мышление, уверенность, стойкость и характер через высококачественное шахматное образование в поддерживающей и вдохновляющей среде.",
      storyTitle: "Наша история",
      storyP1:
        "My Chess Family — это образовательная шахматная программа, посвящённая помощи детям расти не только как игрокам, но и как людям. Через структурированные тренировки, турнирный опыт и поддерживающее наставничество ученики приобретают навыки, выходящие далеко за пределы шахматной доски.",
      storyP2:
        "Программа объединяет опытных тренеров, игроков мастерского уровня и гроссмейстеров, чтобы создать сильную учебную среду для учеников всех уровней — от полных новичков до серьёзных участников турниров.",
      storyP3:
        "Что делает My Chess Family особенной — это чувство связи. Ученики, тренеры и семьи становятся частью настоящего сообщества, построенного на поощрении, дисциплине и долгосрочном росте.",
      founderSectionTitle: "Основано с целью",
      founderSectionSub:
        "Видение My Chess Family основано на сильном обучении, эмпатии и вере в то, что каждый ребёнок может расти через шахматы.",
      founderRole: "Основатель и главный тренер",
      founderName: "Дмитрий Шевелев",
      founderP1:
        "My Chess Family основана ФИДЕ-мастером Дмитрием Шевелевым — опытным шахматным педагогом с более чем двадцатилетним опытом преподавания. Он начал играть в шахматы в шесть лет и начал преподавать в восемнадцать, позже продолжив работу в США.",
      founderP2:
        "За прошедшие годы Дмитрий обучил тысячи учеников через школьные программы, индивидуальные занятия, лагеря и турнирную подготовку. Его работа охватывала как новичков, впервые знакомящихся с игрой, так и продвинутых игроков, готовящихся к серьёзным соревнованиям.",
      founderP3:
        "Его философия проста: каждый ребёнок уникален, и лучшее обучение происходит тогда, когда тренеры понимают, как ученик думает, учится и растёт с уверенностью.",
      valuesTitle: "Что мы помогаем развивать",
      valuesSub:
        "Шахматы используются как образовательный инструмент для развития практических навыков, эмоциональной силы и долгосрочной уверенности.",
      value1Title: "Стратегическое мышление",
      value1Text:
        "Ученики учатся думать наперёд, оценивать варианты и принимать взвешенные решения с большей ясностью.",
      value2Title: "Концентрация и дисциплина",
      value2Text:
        "Шахматы помогают ученикам улучшить сосредоточенность, терпение и способность оставаться вовлечёнными в сложные задачи.",
      value3Title: "Уверенность и стойкость",
      value3Text:
        "Ученики учатся справляться с ошибками, восстанавливаться после поражений и продолжать совершенствоваться с зрелостью и самоверой.",
      value4Title: "Сообщество и характер",
      value4Text:
        "Семьи становятся частью поддерживающей среды, где ученики поощряют друг друга и растут через общий опыт.",
      ctaTitle: "Найдите правильный путь для вашего ребёнка",
      ctaText:
        "Независимо от того, только начинает ваш ребёнок или уже соревнуется, My Chess Family предлагает поддерживающую среду для обучения, роста и развития с уверенностью.",
      faqTitle: "Часто задаваемые вопросы",
      faqSub:
        "Несколько распространённых вопросов, которые родители задают перед началом занятий в My Chess Family.",
      faqs: [
        {
          q: "Какие возрастные группы вы обучаете?",
          a: "My Chess Family работает с детьми от 6 до 16 лет через школьные программы, индивидуальные занятия, лагеря и турнирные тренировки.",
        },
        {
          q: "Нужен ли ребёнку шахматный опыт перед вступлением?",
          a: "Нет. Мы принимаем как полных новичков, так и опытных участников турниров, и направляем каждого ребёнка в соответствии с его уровнем и темпом.",
        },
        {
          q: "Предлагаете ли вы индивидуальные занятия?",
          a: "Да. Мы предлагаем индивидуальный коучинг для учеников, которым нужно больше персонализированного внимания, более быстрый прогресс или целенаправленная турнирная подготовка.",
        },
        {
          q: "Что происходит на летнем лагере?",
          a: "Наши летние лагеря сочетают структурированные занятия, тренировочные партии, решение задач, развлечения и поддерживающую среду, которая держит учеников вовлечёнными.",
        },
        {
          q: "Работаете ли вы со школами и организациями?",
          a: "Да. Мы сотрудничаем со школами, чтобы предоставлять внеклассные шахматные программы, и можем помочь создать правильную структуру для учеников и сообществ.",
        },
        {
          q: "Как выбрать правильную программу для ребёнка?",
          a: "Мы помогаем семьям выбрать лучший вариант, исходя из возраста, текущего уровня, целей и стиля обучения. Свяжитесь с нами, и мы направим вас лично.",
        },
      ],
    },

    /* ── GALLERY PAGE ── */
    gallery: {
      kicker: "Фотогалерея",
      heroTitle: "Жизнь в MyChessFamily",
      heroSub:
        "Взгляд внутрь наших занятий, летних лагерей и моментов, которые делают наше шахматное сообщество особенным. Настоящие ученики. Настоящий рост. Настоящие воспоминания.",
      stat1n: "500+",
      stat1l: "Учеников",
      stat2n: "8+",
      stat2l: "Лет воспоминаний",
      stat3n: "3",
      stat3l: "Лагеря в год",
      filterAll: "Все фото",
      filterCamps: "Летние лагеря",
      filterLessons: "Занятия",
      filterCommunity: "Сообщество",
      loading: "Загрузка галереи...",
      noPhotos: "Пока нет фотографий",
      noPhotosSub: "Фотографии появятся здесь после загрузки администратором.",
      ctaTitle: "Станьте частью истории MyChessFamily",
      ctaText:
        "Каждое фото здесь представляет ученика, который выбрал учиться, соревноваться и расти. Присоединяйтесь к нам и создайте свои воспоминания на доске.",
    },

    /* ── CONTACT PAGE ── */
    contact: {
      kicker: "Свяжитесь с нами",
      heroTitle: "Мы рады вашему обращению",
      heroSub:
        "Есть вопросы о наших программах, лагерях или индивидуальных занятиях? Заполните форму, и мы ответим в течение 24 часов.",
      info: [
        {
          label: "Местоположение",
          value: "Нью-Йорк",
          note: "Обслуживаем все районы Нью-Йорка и прилегающие территории",
        },
        {
          label: "Email",
          value: "mychessfamily@gmail.com",
          actionLabel: "Нажмите, чтобы скопировать",
        },
        {
          label: "Часы работы",
          value: "Пн – Сб · 9:00 – 19:00",
          note: "Восточное время · Воскресенье выходной",
        },
        {
          label: "Время ответа",
          value: "В течение 24 часов",
          note: "Обычно значительно быстрее в рабочие часы",
        },
      ],
      socialTitle: "Подписывайтесь",
      quickLinksTitle: "Быстрые ссылки",
      quickLinks: [
        ["programs", "♟ Смотреть программы"],
        ["camp", "☀️ Летний лагерь"],
        ["team", "👥 Наша команда"],
        ["reviews", "⭐ Читать отзывы"],
      ],
      formTitle: "Отправьте нам сообщение",
      formSub:
        "Расскажите о вашем ребёнке, что вы ищете, и задайте любые вопросы. Мы лично ответим с лучшими вариантами.",
      firstName: "Имя",
      firstNamePh: "напр. Алекс",
      lastName: "Фамилия",
      lastNamePh: "напр. Иванов",
      email: "Email",
      emailPh: "parent@email.com",
      phone: "Телефон",
      phonePh: "(212) 555-0000",
      interestedIn: "Меня интересует",
      interestedPh: "Выберите программу (необязательно)",
      interestedOpts: [
        "Индивидуальные занятия",
        "Школьная шахматная программа",
        "Летний лагерь",
        "Подготовка к турнирам",
        "Командные тренировки",
        "Общий вопрос",
      ],
      subject: "Тема",
      subjectPh: "напр. Вопрос о цене летнего лагеря",
      message: "Сообщение",
      messagePh:
        "Расскажите о возрасте вашего ребёнка, уровне опыта и чего вы хотите достичь...",
      errRequired: "Пожалуйста, заполните все обязательные поля.",
      errEmail: "Пожалуйста, введите корректный email адрес.",
      privacy:
        "Отправляя эту форму, вы соглашаетесь получать информацию о программах MyChessFamily. Мы никогда не передаём ваши данные.",
      successTitle: "Сообщение получено!",
      successSub1: "Спасибо за обращение. Мы ответим в течение 24 часов на",
      successSub2:
        "А пока вы можете ознакомиться с нашими программами или узнать о летнем лагере.",
      sendAnother: "Отправить ещё",
      ctaTitle: "Готовы начать?",
      ctaText:
        "Присоединяйтесь к сотням нью-йоркских учеников, которые выросли в мастерстве, уверенности и характере через MyChessFamily. Первый шаг — это просто сообщение.",
    },

    /* ── CONTACT MODAL (popup) ── */
    contactModal: {
      title: "Контакты",
      clickToCopy: "Нажмите, чтобы скопировать",
      fastest: "Для быстрого ответа — напишите нам на email.",
    },

    /* ── CHATBOT ── */
    chatbot: {
      title: "♟ Шахматный помощник",
      sub: "Служба поддержки MyChessFamily",
      placeholder: "Спросите о программах, лагерях, занятиях...",
      send: "Отправить",
      suggestions: [
        "Какие программы вы предлагаете?",
        "Сколько стоит летний лагерь?",
        "Есть ли индивидуальные занятия?",
        "Какие возрастные группы вы обучаете?",
      ],
      welcome:
        "Привет! Я помощник MyChessFamily. Задайте вопрос о программах, лагерях, индивидуальных занятиях или возрастных группах.",
      fallback:
        "Извините, не могу ответить прямо сейчас. Напишите на mychessfamily@gmail.com.",
    },

    /* ── 404 PAGE ── */
    notFound: {
      code: "404",
      title: "Похоже, эта страница сделала незаконный ход",
      sub: "Страница, которую вы ищете, не существует или была перемещена. Не переживайте — даже гроссмейстеры иногда ошибаются. Давайте вернём вас на доску.",
      btn1: "♔ На главную",
      btn2: "♟ Программы",
    },

    /* ── LOGIN PAGE ── */
    login: {
      title: "Вход для администратора",
      sub: "Войдите для управления лагерями и просмотра регистраций.",
      username: "Имя пользователя",
      password: "Пароль",
      demo: "Демо-данные:",
      wrongCreds: "❌ Неверные данные. Используйте: admin / chess123",
    },

    /* ── ADMIN PAGE ── */
    admin: {
      welcome: "Добро пожаловать, Admin! 👋",
      label: "Панель администратора",
      tabs: {
        camps: "☀️ Управление лагерями",
        campregs: "🏕 Записи в лагерь",
        reviews: "⭐ Отзывы",
        gallery: "📸 Галерея",
      },
      stats: {
        sessions: "Сессии лагеря",
        signups: "Записи в лагерь",
        revenue: "Ожидаемый доход",
      },
      addCamp: "➕ Добавить сессию лагеря",
      editCamp: "✏️ Изменить сессию лагеря",
      fields: {
        name: "Название сессии лагеря",
        namePh: "напр. Летний лагерь – Сессия 3",
        startDate: "Дата начала",
        endDate: "Дата окончания",
        location: "Место проведения",
        locationPh: "напр. Chess Club HQ",
        type: "Тип сессии",
        age: "Возрастная группа",
        price: "Цена за ребёнка ($)",
        pricePh: "напр. 350",
        spots: "Макс. мест",
        spotsPh: "напр. 20",
        status: "Статус",
        image: "Изображение лагеря",
        desc: "Описание",
        descPh: "Что включено в эту сессию...",
      },
      statusOpts: { open: "Открыто", upcoming: "Скоро", full: "Заполнено" },
      typeOpts: ["Полдня (9:00–13:00)", "Полный день (9:00–17:00)"],
      ageOpts: [
        "Все возрасты (6–16)",
        "Младшие (6–10)",
        "Средние (11–13)",
        "Старшие (14–16)",
      ],
      addBtn: "Добавить сессию лагеря →",
      updateBtn: "Обновить сессию лагеря →",
      published: "✅ Сессия лагеря опубликована!",
      updated: "✅ Лагерь обновлён!",
      allSessions: "Все сессии лагеря",
      noSessions: "Пока нет сессий лагеря.",
      signupsTitle: "Записи в лагерь",
      noSignups: "Пока нет записей в лагерь.",
      reviewsTitle: "Отзывы",
      noReviews: "Пока нет отзывов.",
      galleryTitle: "Фотографии галереи",
      noPhotos: "Фотографии ещё не загружены.",
      uploadTitle: "📸 Загрузить новое фото",
      galleryFields: {
        photo: "Фото",
        caption: "Подпись",
        captionPh: "напр. Ученики на летнем лагере 2024",
        category: "Категория",
        tag: "Тег (необязательно)",
        tagPh: "напр. Летний лагерь 2024",
      },
      categoryOpts: [
        { value: "camps", label: "Летние лагеря" },
        { value: "lessons", label: "Занятия" },
        { value: "community", label: "Сообщество" },
      ],
      deleteConfirmCamp: "Удалить эту сессию лагеря?",
      deleteConfirmSignup: "Удалить эту запись в лагерь?",
      deleteConfirmReview: "Удалить этот отзыв?",
      deleteConfirmPhoto: "Удалить это фото?",
      statusUpdated: "Статус обновлён!",
      deleted: "Удалено.",
      approved: "✅ Одобрено!",
      signupDeleted: "Запись удалена.",
    },

    /* ── BADGE STATUS ── */
    badge: {
      open: "Открыто",
      full: "Заполнено",
      upcoming: "Скоро",
    },

    /* ── TOASTS ── */
    toast: {
      emailCopied: "📋 Email скопирован!",
      regSubmitted: "🎉 Заявка отправлена!",
      reviewSubmitted: "✅ Отзыв отправлен! Ожидает одобрения администратора.",
      messageSent: "✅ Сообщение отправлено!",
      photoUploaded: "📸 Фото загружено!",
      loggedIn: "✅ Добро пожаловать, Admin!",
      loggedOut: "👋 Вы вышли.",
      fallbackData:
        "Используются локальные данные. Запустите сервер для синхронизации.",
    },
  },
};
