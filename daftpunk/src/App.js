import './App.css';
import ReactAudioPlayer from 'react-audio-player';

function App() {

  return (
    <div className="App">
        <ReactAudioPlayer
            src="daftpunkaudio.mp3"
            autoPlay
            controls
        />
      <header className="App-header">
        <title>DaftPunk Concert</title>
        <script defer src="index.js" type="module"></script>
      </header>
      <body>
        <canvas className="webgl"></canvas>
      </body>
    </div>
  );
}

export default App;
