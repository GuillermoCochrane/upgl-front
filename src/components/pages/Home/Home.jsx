import {Link} from "react-router-dom";
import Logo from "../../../assets/images/logoUPGL.png";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const [coursesLinks, setCoursesLinks] = useState([]);

  useEffect(() => {
    const endpoint = `${apiUrl}api/course/index`;
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                setCoursesLinks(data.data);
            }
            catch (error) {
                console.log(error);
                setCoursesLinks([]);
            }
        }
        fetchData()
  }, []);

  return (
    <article className="home">
        <img src={Logo} alt="Logo de UPGL" className="logo" />
        <h1 className="UPGL" >Universidad Popular General Levalle</h1>
        <h2>Seleccione su curso</h2>
        <section>
        {
          coursesLinks.map((item, index) => (
            <h3 key={index}>
              <Link to={item.link} key={index}>
                {item.name}
              </Link>
            </h3>
          ))
        }
        </section>
    </article>
  )
}

export default Home