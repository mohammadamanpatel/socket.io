import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { io } from 'socket.io-client'
function App() {
  const socket = io('http://localhost:3000');
  const [message, setMessage] = useState('');
  const [socketId,setSocketId] = useState(null)
  const [messageArray,setMessageArray] = useState([])
  const [room,setRoom] = useState('')
  const [roomname,setRoomname] = useState('')
  console.log(messageArray);
  const handleChange1 = (event) => {
    setMessage(event.target.value);
  }
  const handleChange2 = (event) => {
    setRoom(event.target.value);
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted value:', {message,room});
    socket.emit('message',{message,room})
    setMessage('');
    setRoom('');
    // setMessageArray([]);
  };
  const RoomNamehandle = (event)=>{
    event.preventDefault();
    socket.emit('set-room-name',roomname)
    setRoomname('')
  }
  useEffect(() => {
    socket.on('connect', () => {
      console.log("connected", socket.id)
      setSocketId(socket.id)
    })
    socket.on('welcome', (s) => {
      console.log(`welcome server ${s},${socket.id}`);
    })
    socket.on('recieve',(data)=>{
      console.log("data",data);
      setMessageArray((message)=>[...message,data])
    })
    return () => {
      console.log("disconnected");
      socket.disconnect()
    }
  }, [])
  return (
    <>
      <h2>{socketId}</h2>
      <form onSubmit={RoomNamehandle}>
          <input
            type="text"
            value={roomname}
            onChange={(e)=>{setRoomname(e.target.value)}}
            placeholder="room-name"
          />
        <button type="submit">Set-roomName</button>
      </form>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={handleChange1}
            placeholder="message"
          />
          <input
            type="text"
            value={room}
            onChange={handleChange2}
            placeholder="room"
          />
        <button type="submit">Submit</button>
      </form>
      {
        messageArray.map((messages)=>(
          <div>{messages}</div>
        ))
      }
    </>
  )
}

export default App
