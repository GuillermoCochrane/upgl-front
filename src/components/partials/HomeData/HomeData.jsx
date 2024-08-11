import PropTypes  from "prop-types";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function HomeDataAI({course}) {
    const [homeData, setHomeData] = useState([]);
    useEffect(() => {
        const endpoint = `${apiUrl}api/course/index`;
        const fetchData = async () => {
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                let info = data.data.filter(courseData => courseData.id.toUpperCase() === course.toUpperCase());
                setHomeData(info[0]);
            }
            catch (error) {
                console.log(error);
                setHomeData([]);
            }
        }
        fetchData()
    },[course]);

    return (
        <>
        <h2>{homeData.title}</h2>
        <p>
            {homeData.intro}
        </p>
        <br/>
        <p>
            {homeData.paragraph}
        </p>
        <hr/>
        </>
    )
}

HomeDataAI.propTypes = {
    course: PropTypes.string.isRequired
}
export default HomeDataAI;