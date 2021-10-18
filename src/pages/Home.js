import { useHistory } from 'react-router';

export default function Home() {
  let history = useHistory();
  const start = () => {
    history.push('/map');
  };
  return (
    <div>
      <div className="cover">
        <div className="overlay"></div>
        <div className="title">
          <h1>Enjoy Your Trip in Melbourne</h1>
          <div className="button" onClick={start}>
            Start
          </div>
        </div>
      </div>
    </div>
  );
}
