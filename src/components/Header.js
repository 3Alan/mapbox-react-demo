import logo from '../assets/images/logo.jpg';

export default function Header() {
  return (
    <div className="title-wrap">
      <img src={logo} />
      <h2>TravelExploring</h2>
    </div>
  );
}
