// ============================================================
// AMIOUT Enterprise Edition
// Navbar Motion Variants
// ============================================================

export const navbarVariants = {
  hidden: {
    y: -80,
    opacity: 0,
  },

  visible: {
    y: 0,
    opacity: 1,

    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const mobileDrawerVariants = {
  hidden: {
    x: "100%",
    opacity: 0,
  },

  visible: {
    x: 0,
    opacity: 1,

    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },

  exit: {
    x: "100%",
    opacity: 0,

    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

export const overlayVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.2,
    },
  },

  exit: {
    opacity: 0,

    transition: {
      duration: 0.2,
    },
  },
};

export const megaMenuVariants = {
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: 15,
    scale: 0.98,

    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const navItemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,

    transition: {
      delay: index * 0.06,
      duration: 0.3,
    },
  }),
};
