import PropTypes  from "prop-types";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function HomeDataAI({course}) {
    let courseID = course;
    const [homeData, setHomeData] = useState([]);
    useEffect(() => {
        const endpoint = `${apiUrl}api/course/${courseID}/class/home`;
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                setHomeData(data.data);
            }
            catch (error) {
                console.log(error);
                setHomeData([]);
            }
        }
        fetchData()
    },[courseID]);

    return (
        <>
        <h2>{homeData.title}</h2>
        <p>
            {homeData.p1}
        </p>
        <br/>
        <p>
            {homeData.p2}
        </p>
        <hr/>
        </>
    )
}

HomeDataAI.propTypes = {
    course: PropTypes.string.isRequired
}
export default HomeDataAI;