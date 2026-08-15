export const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: index * 0.1,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};
