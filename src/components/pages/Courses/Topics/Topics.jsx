/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import OL from '../../../partials/Courses/OL/OLTag.jsx';
import UL from '../../../partials/Courses/UL/ULTag.jsx';
import PTag from '../../../partials/Courses/P/PTag.jsx';
import H4 from '../../../partials/Courses/H4/H4Tag.jsx';
import H3 from '../../../partials/Courses/H3/H3Tag.jsx';
import H2 from '../../../partials/Courses/H2/H2Tag.jsx';
import Figure from '../../../partials/Courses/Figure/Figure.jsx';
import Answer from '../../../partials/Courses/Answer/Answer.jsx';
import NavButtons from '../../../partials/Courses/Navbuttons/NavButtons.jsx';
import Links from '../../../partials/Courses/Links/Links.jsx';
import Youtube from '../../../partials/Courses/Youtube/Youtube.jsx';
import Table from '../../../partials/Courses/Table/Table.jsx';
import Trivia from '../../../partials/Courses/Trivia/Trivia.jsx';
import NotFound from '../../../partials/Courses/NotFound/NotFound.jsx';
const apiUrl = import.meta.env.VITE_API_URL;

function Topics(params) {
  const [classData, setClassData] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState({});
  const [title, setTitle] = useState([]);
  const course = params.match.path.split("/")[2].toLowerCase();
  const classID  = parseInt(params.match.params.classId);
  const topicID = parseInt(params.match.params.topicId);

  useEffect(() => {
    let fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}api/course/${course}/class/`);
        const data = await response.json();
        let classes = (data.data);
        let newData = classes.filter(item => item.class === classID);
        (newData.length === 0) ? 
                              setClassData([]) :
                              setClassData(newData[0].classData);

        let pageData = {
          class: classID, 
          topic: topicID,
          course: course,
          topics: newData[0].topics,
          classes: classes[classes.length-1].class, //sacar de data.meta.classes, despues de corregirlo en el backend
          lastClassLastTopic: classID > 1 ? classes.filter(item => item.class === classID-1)[0].topics : 0,
        };

        setPage(pageData);
        newData.length > 0 ? setTitle(newData[0].title.info) : null;
      }
      catch (error) {
        console.log(error);
        setClassData([]);
      }
    }

    fetchData();

  }, [classID, topicID ]);

  useEffect(() => {
    let newData = classData.filter(item => item.topic == topicID);
    (newData.length === 0) ?
      setData([]) :
      setData(newData[0].topicData);
  }, [classData, topicID]);

  return (
    <article>
      <H2  Data={title} />
      {
        data.length == 0 ? <NotFound /> :
        data.map((item, index) => {
          return(
          item.type === "h2" ? <H2 key={index} Data={item.info} /> :
          item.type === "figure" ? <Figure key={index} Data={item.info} /> :
          item.type === "h3" ? <H3 key={index}  Data={item.info} /> :
          item.type === "h4" ? <H4 key={index} Data={item.info} /> :
          item.type === "p" ? <PTag key={index} Data={item.info} /> :
          item.type === "ul" ? <UL key={index} Data={item.info} /> : 
          item.type === "link" ? <Links key={index} Data={item.info} /> :
          item.type === "answer" ? <Answer key={index} Data={item.info} /> :
          item.type === "youtube" ? <Youtube key={index} Data={item.info} /> :
          item.type === "trivia" ? <Trivia key={index} Data={item.info} Answer={item.answer} /> :
          item.type === "table" ? <Table key={index} Data={item.info} Columns={item.columns} Title={item.title} /> :
          item.type === "ol" ? <OL key={index} Data={item.info}  /> : null
        )})
      }
      {
        data.length == 0 ? null : 
        <NavButtons Page={page} />
      }
    </article>
  );
}

export default Topics;