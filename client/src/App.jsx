import { useState, useEffect } from "react";
import { MDBRow, MDBCol, MDBListGroup, MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";
import "./App.css";
import Quiz from "./components/Quiz";
import Start from "./components/Start";

function App() {
  const [name, setName] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeOut, setTimeOut] = useState(false);
  const [earned, setEarned] = useState("");
  const [newData, setNewData] = useState([]);
  const [newPrizeMoney, setNewPrizeMoney] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await axios.post(`http://localhost:3001/fetch/questions`, {
        easy: 4,
        medium: 4,
        hard: 4
      });

      if (response?.status === 200 && response.data) {
        setNewData(response.data);
      } else {
        setNewData([]);
      }

      response = await axios.post(`http://localhost:3001/fetch/prizes`);

      if (response?.status === 200 && response?.data) {
        setNewPrizeMoney(response.data);
      } else {
        setNewPrizeMoney([]);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    questionNumber > 1 &&
      setEarned(
        newPrizeMoney.find((item) => item.level === questionNumber).amount
      );
  }, [questionNumber]);

  if (newData?.length >= 1 && newPrizeMoney?.length >= 1) {
    return (
      <div className="App">
        {!name ? (
          <Start setName={setName} setTimeOut={setTimeOut} />
        ) : (
          <MDBRow>
            <MDBCol md="9">
              <div className="main">
                {timeOut ? (
                  <h1 className="earned">You Earned: {earned}</h1>
                ) : (
                  <>
                    <div style={{ height: "50%", position: "relative" }} />
                    <div style={{ height: "50%" }}>
                      <Quiz
                        newData={newData}
                        questionNumber={questionNumber}
                        setQuestionNumber={setQuestionNumber}
                        setTimeOut={setTimeOut}
                      />
                    </div>
                  </>
                )}
              </div>
            </MDBCol>
            <MDBCol md="3" className="money">
              <MDBListGroup className="money-list">
                <MDBRow>
                  <span className="mb-2">
                    <MDBBtn
                      style={{ float: "right" }}
                      className="mx-2"
                      color="light"
                      onClick={() => setTimeOut(true)}
                    >
                      Quit
                    </MDBBtn>
                    <MDBBtn
                      style={{ float: "right" }}
                      onClick={() => {
                        setName(null);
                        setQuestionNumber(1);
                        setEarned("");
                      }}
                    >
                      Exit
                    </MDBBtn>
                  </span>
                  <MDBCol md="6">Name: {name}</MDBCol>
                  <MDBCol md="6">Total Earned: {earned}</MDBCol>
                </MDBRow>
                <hr />
                {
                  newPrizeMoney.map((item, index) => (
                    <li
                      className={
                        questionNumber === item.level ? "item active" : "item"
                      }
                      key={index}
                    >
                      <h5 className="amount">{item.prize}</h5>
                    </li>
                  ))}
              </MDBListGroup>
            </MDBCol>
          </MDBRow>
        )}
      </div>
    );
  } else {
    return (<>
      Loading
    </>);
  }

}

export default App;
