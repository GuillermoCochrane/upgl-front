import {Link} from "react-router-dom";
import Logo from "../../../assets/images/logoUPGL.png";
import { useEffect, useState } from "react";
import Loader from "../shared/Loader/Loader";
const apiUrl = import.meta.env.VITE_API_URL;
console.log(Logo);

function Home() {
  const [coursesLinks, setCoursesLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = `${apiUrl}api/course/index`;
    setLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                setCoursesLinks(data.data);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                setCoursesLinks([]);
                setLoading(false);
            }
        }
        fetchData()
  }, []);

  return (
    <article className="home">
        <img src={Logo} alt="Logo de UPGL" className="logo" />
        <h1 className="UPGL" >Universidad Popular General Levalle</h1>
        <h2>Seleccione su curso</h2>
        {
          loading ? 
            <Loader loaderStyles={"home"}  /> :
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
        }
    </article>
  )
}

export default Home