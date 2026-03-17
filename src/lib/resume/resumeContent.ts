export interface ResumeContent {
  name: string
  title: string
  description: string
  skills: string[]
}

export const resumeContent: Record<string, ResumeContent> = {
  "pt-BR": {
    name: "Sérgio Santos",
    title: "Especialista em Ciência de Dados e Inteligência Artificial",
    description:
      "Currículo de Sérgio Santos, especialista em Data Science, IA generativa, Python, Java, Cloud e Arquitetura de Sistemas.",
    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure",
      "Arquitetura de Sistemas"
    ]
  },

  "en-US": {
    name: "Sergio Santos",
    title: "Data Science and AI Specialist",
    description:
      "Resume of Sergio Santos, expert in Data Science, Generative AI, Python, Java, Cloud Computing and Systems Architecture.",
    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure",
      "AI Engineering"
    ]
  },

  "es-ES": {
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum de Sergio Santos, experto en Data Science, IA generativa, Python, Java y arquitectura cloud.",
    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure"
    ]
  },

  "es-AR": {
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum profesional de Sergio Santos, especialista en Data Science, IA generativa y arquitectura cloud.",
    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing"
    ]
  },

  "es-MX": {
    name: "Sergio Santos",
    title: "Especialista en Ciencia de Datos e Inteligencia Artificial",
    description:
      "Currículum profesional de Sergio Santos, especialista en Data Science, IA generativa y arquitectura cloud.",
    skills: [
      "Python",
      "Java",
      "Machine Learning",
      "Cloud Computing"
    ]
  }
}
