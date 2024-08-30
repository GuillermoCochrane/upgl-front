import  { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Route, Switch, Link } from "react-router-dom";
import Error404 from "../Error404/Error404.jsx";
import ClassIndex from "./ClassIndex/ClassIndex.jsx";
import Topics from "./Topics/Topics.jsx";
import NavBarIndex from "../shared/NavBarIndex/NabBarIndex.jsx";
import Logo from "../../../assets/images/logoUPGL.png";
const apiUrl = import.meta.env.VITE_API_URL;

function Courses({ match }) {
  const  courseId  = match.params.courseId.toLowerCase();
  const navBar = useRef(null);
  const handleClick = () => {
    navBar.current.classList.toggle("hidden");
  }

  const [index, setIndex] = useState([]);

  useEffect(() => {
    const endpoint = `${apiUrl}api/course/${courseId}`;
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setIndex(data.data);
      }
      catch (error) {
        console.log(error);
        setIndex([]);
      }
    }
    fetchData();
  }, [courseId]);
  
  return (
    <>
      <header>
          <button onClick={handleClick} id="index">Índice</button>
          {courseId.toUpperCase() == "IA" && <h1>Curso de ChatGPT e Inteligencia Artificial</h1>}
          {courseId.toUpperCase() == "PYTHON" && <h1>Curso de Python</h1>}
          <Link to="/" className="logo-link">
            <img src={Logo} alt="Logo de UPGL" className="logo-icon" />
          </Link>
      </header>
      <main>
        <nav className="sumario" ref={navBar}>
          <ol>
            {
              index.map((item, idx) => (
                <NavBarIndex data={item} key={idx} />
              ))
            }
          </ol>
          <Link to={`/courses/${courseId}`}>	
            <button>Volver al índice</button>
          </Link> 
        </nav>
        <Switch>
          <Route path={`${match.url}`} exact component={ClassIndex} />
          <Route path={`${match.url}/class`} exact component={ClassIndex} />
          <Route path={`${match.url}/class/:classId`} exact component={ClassIndex} />
          <Route path={`${match.url}/class/:classId/:topicId`} exact component={Topics} /> 
          <Route component={Error404} />
        </Switch>
      </main>
    </>
  );
}

Courses.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Courses;
