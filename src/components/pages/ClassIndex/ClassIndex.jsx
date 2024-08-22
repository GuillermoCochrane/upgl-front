import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import NotFound from '../../partials/Courses/NotFound/NotFound';
import HomeData from '../../partials/Courses/HomeData/HomeData';
const apiUrl = import.meta.env.VITE_API_URL;

function ClassIndex(params) {
    const  id  = parseInt(params.match.params.classId);
    const [data, setData] = useState([]);
    const course = params.match.path.split("/")[2].toLowerCase();

    useEffect(() => {
        let endpoint = `${apiUrl}api/course/${course}/`;
        id ? endpoint = `${apiUrl}api/course/${course}/${id}` : null;
        const fetchData = async () => {
            if(course){
                try {
                    const response = await fetch(endpoint);
                    const data = await response.json();
                    let classIndex = data.data;
                    setData(classIndex);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        fetchData();
        
    }, [id, course]);

    return (
        <article>
            {
                !id ? <HomeData  course={course}/> : null
            }
            {
                id  ?
                <h2 className='index-title'>Temas de la clase {id}</h2> : 
                <h2 className='index-title'>Índice de clases</h2>
            }
            
            {
                data && data.length == 0 ? <NotFound  /> :
                data.map((item, index) => (
                    <section key={index}>
                        <h2 className='index-subtitle'>{item.summary}</h2>
                        <ol className='topics-index'>
                            {
                                item.links.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.link}>
                                            {item.title}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ol>
                    </section>
                ))
            }
        </article>
    )
}

export default ClassIndex;