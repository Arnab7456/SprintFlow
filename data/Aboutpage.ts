export interface AboutProps {
  id: number;
  title: string;
  points?: { id: number; description: string }[];
}

export const AboutData: AboutProps[] = [
  {
      id: 1,
      title:
          "SprintFlow is an intelligent workflow automation platform designed to streamline agile development processes. Leveraging AI-driven analytics and real-time task orchestration, SprintFlow enhances team collaboration, sprint planning, and progress tracking with precision and efficiency.",
      points: [
          { id: 1, description: "AI-powered workflow automation for agile teams." },
          { id: 2, description: "Real-time sprint tracking and intelligent backlog management." },
      ],
  },
  {
      id: 2,
      title:
          "Scrum-App is a next-generation agile management tool that optimizes sprint execution using machine learning insights and predictive task prioritization. It seamlessly integrates with modern DevOps pipelines, ensuring continuous delivery and high-velocity development cycles.",
      points: [
          { id: 1, description: "ML-based sprint optimization and task prioritization." },
          { id: 2, description: "Seamless integration with DevOps workflows for enhanced CI/CD." },
      ],
  },
  {
      id: 3,
      title:
          "Our latest features introduce AI-assisted sprint retrospectives, intelligent workload distribution, and automated performance analytics. These enhancements empower teams to make data-driven decisions, identify bottlenecks proactively, and optimize resource allocation for maximum efficiency.",
      points: [
          { id: 1, description: "AI-assisted sprint retrospectives with actionable insights." },
          { id: 2, description: "Automated workload balancing and real-time performance analytics." },
      ],
  },
];
