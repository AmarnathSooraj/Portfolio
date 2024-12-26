import styles from './ProjectsStyles.module.css';
import porfolio from '../../assets/portfolio.png';
import resp from '../../assets/responsive-design.png';
import web from '../../assets/web-programming.png';
import ProjectCard from '../../common/ProjectCard';

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectsContainer}>
        <ProjectCard
          src={porfolio}
          link="https://github.com/AmarnathSooraj/Portfolio"
          h3="My Portfolio"
        />
        <ProjectCard
          src={resp}
          link="https://github.com/AmarnathSooraj/Responsive-webpage"
          h3="Responsive design"
        />
        <ProjectCard
          src={web}
          link="https://github.com/AmarnathSooraj/Sociallydemo"
          h3="Branding Web"
        />
      </div>
    </section>
  );
}

export default Projects;
