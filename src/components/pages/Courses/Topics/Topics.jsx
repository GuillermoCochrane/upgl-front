/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import OL from "./OL/OLTag.jsx";
import UL from "./UL/ULTag.jsx";
import PTag from "./P/PTag.jsx";
import H4 from "./H4/H4Tag.jsx";
import H3 from "./H3/H3Tag.jsx";
import H2 from "./H2/H2Tag.jsx";
import Figure from "./Figure/Figure.jsx";
import Answer from "./Answer/Answer.jsx";
import NavButtons from "./Navbuttons/NavButtons.jsx";
import Links from "./Links/Links.jsx";
import Youtube from "./Youtube/Youtube.jsx";
import Table from "./Table/Table.jsx";
import Trivia from "./Trivia/Trivia.jsx";
import NotFound from "../../shared/NotFound/NotFound.jsx";
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
          item.type === "download" ? <Links key={index} Data={item.info} /> :
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