import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import NotFound from '../../partials/NotFound/NotFound';
import HomeData from '../../partials/HomeData/HomeData';

function ClassIndex(params) {
    const  id  = parseInt(params.match.params.classId);
    const [data, setData] = useState([]);
    const [classId, setClassId] = useState("");
    const course = params.match.path.split("/")[2];

    useEffect(() => {
        setClassId(id);
    }, [id]);
    
    useEffect(() => {
        const endpoint = `http://localhost:6006/api/${course}`;
        const fetchData = async () => {
            if(course){
                try {
                    const response = await fetch(endpoint);
                    const data = await response.json();
                    let classIndex = data.data
                    if (classId){
                        let newData = classIndex.filter(item => item.classId == classId);
                        (newData.length === 0) ?
                            setData([]) :
                            setData(newData);
                        } else {
                            setData(classIndex);
                        }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        fetchData();
        
    }, [classId, course]);

    return (
        <article>
            {
                !classId ? <HomeData  course={course}/> : null
            }
            {
                classId  ?
                <h2 className='index-title'>Temas de la clase {classId}</h2> : 
                <h2 className='index-title'>Índice de clases</h2>
            }
            
            {
                data && data.length == 0 ? <NotFound  /> :
                data.map((item, index) => (
                    <section key={index}>
                        <h2>{item.summary}</h2>
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