import { useState, useEffect } from "react";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChat, setPreviousChat] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const [userImage, setUserImage] = useState(null);
  const [botImage, setBotImage] = useState(null);
  const loadImages = async () => {
    const userImage = await require("./chatGPT.png");
    const botImage = await require("./chatGPT.png");

    setUserImage(userImage);
    setBotImage(botImage);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      // console.log(data);
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     getMessages();
  //     setValue("");
  //   }
  // };

  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     document.getElementById("submit").click();
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyPress);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, []);

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChat((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
          botImage: botImage,
        },
      ]);
    }
  }, [message, currentTitle]);

  console.log(previousChat);

  const currentChat = previousChat.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChat.map((previousChat) => previousChat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Kirti</p>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && <h1>KirtiGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <div className="role-container">
                <img src={botImage} alt="bot" />
                <p className="role">{chatMessage.role}: </p>
              </div>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              placeholder="Send a message"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages}>
              &#11162;
            </div>
          </div>

          <p className="info">
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts. <span>ChatGPT May 24 Version</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
